export async function onRequestPost({ request, env }) {
  try {
    const payload = await request.json();
    const { student, report } = payload || {};
    if (!student?.name || !student?.phone || !student?.grade || !report) {
      return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const tasks = [];

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const topicLines = Object.entries(report.topics || {})
        .map(([name, value]) => `• ${name}: ${value.got}/${value.total}`)
        .join("\n");
      const message = [
        "🧠 BILIQ — жаңа диагностика",
        `Оқушы: ${student.name}`,
        `Телефон: ${student.phone}`,
        `Сынып: ${student.grade}`,
        `Нәтиже: ${report.score}/${report.total} (${report.percent}%)`,
        `Қорытынды: ${report.title}`,
        "Тақырыптар:",
        topicLines
      ].join("\n");

      tasks.push(fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message })
      }).then(async response => {
        if (!response.ok) throw new Error("Telegram delivery failed");
      }));
    }

    if (env.GOOGLE_APPS_SCRIPT_URL) {
      tasks.push(fetch(env.GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submittedAt: payload.submittedAt || new Date().toISOString(),
          name: student.name,
          phone: student.phone,
          grade: student.grade,
          score: report.score,
          total: report.total,
          percent: report.percent,
          level: report.title,
          topicResults: Object.entries(report.topics || {})
            .map(([name, value]) => `${name}: ${value.got}/${value.total}`).join("; "),
          detailedAnswers: JSON.stringify(report.answers || [])
        })
      }).then(async response => {
        if (!response.ok) throw new Error("Google Sheets delivery failed");
      }));
    }

    if (!tasks.length) {
      return Response.json({ ok: false, error: "Destinations are not configured" }, { status: 503 });
    }

    const results = await Promise.allSettled(tasks);
    const successful = results.filter(result => result.status === "fulfilled").length;
    if (!successful) {
      return Response.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }

    return Response.json({ ok: true, delivered: successful });
  } catch (error) {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
