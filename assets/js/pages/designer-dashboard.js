(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;

  function myProjectIds() { return CS.ui.projectsFor(user).filter((p) => p.status !== "archived").map((p) => p.id); }

  function render() {
    CS.ui.state($("taskList"), "loading");
    CS.ui.state($("feedbackList"), "loading");
    CS.api.list("tasks", (t) => t.assigneeId === user.id && !t.archived).then((tasks) => {
      const pids = myProjectIds();
      const versions = CS.store.list("versions").filter((v) => pids.includes(v.projectId) && v.status !== "archived");
      const pending = versions.filter((v) => v.isLatest && v.status === "pending").length;
      const needChange = versions.filter((v) => v.isLatest && ["changes", "rejected"].includes(v.status)).length;
      const overdue = tasks.filter((t) => t.status !== "done" && t.due < CS.ui.today()).length;
      const items = [[pids.length, "Dự án đang làm"], [tasks.filter((t) => t.status !== "done").length, "Việc chưa xong"], [pending, "Phiên bản chờ khách duyệt"], [overdue + needChange, "Cần xử lý gấp"]];
      $("stats").innerHTML = items.map(([n, l]) => `<article class="card stat"><p class="num">${n}</p><p class="lbl">${l}</p></article>`).join("");
      renderTasks(tasks);
      renderFeedback(versions);
    }).catch((e) => {
      CS.ui.state($("taskList"), "error", { msg: e.message, onRetry: render });
      $("feedbackList").innerHTML = ""; $("stats").innerHTML = "";
    });
  }

  function renderTasks(all) {
    const f = $("taskFilter").value;
    const rows = all.filter((t) => !f || t.status === f).sort((a, b) => (a.due > b.due ? 1 : -1));
    const host = $("taskList");
    if (!all.length) { CS.ui.state(host, "empty", { icon: "🎉", msg: "Bạn chưa được giao việc nào." }); return; }
    if (!rows.length) { CS.ui.state(host, "empty", { icon: "🔎", msg: "Không có việc nào ở trạng thái này." }); return; }
    host.innerHTML = '<ul style="list-style:none;margin:.6rem 0 0;padding:0">' + rows.map((t) => {
      const late = t.status !== "done" && t.due < CS.ui.today();
      const proj = CS.store.get("projects", t.projectId);
      return `<li class="comment"><header style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap"><strong>${esc(t.title)}</strong>${CS.ui.statusBadge(t.status)}</header>
        <p style="font-size:.82rem;color:var(--muted);margin:0">${esc(proj ? proj.name : "")} · Hạn ${CS.ui.fmtDate(t.due)} ${late ? '<span class="badge err">Quá hạn</span>' : ""}</p>
        ${t.status !== "done" ? `<div class="actions" style="margin-top:.3rem">${t.status === "todo" ? `<button class="btn sm" data-move="doing" data-id="${t.id}">Bắt đầu</button>` : ""}${t.status === "doing" ? `<button class="btn sm" data-move="review" data-id="${t.id}">Gửi review</button>` : ""}</div>` : ""}</li>`;
    }).join("") + "</ul>";
  }

  function renderFeedback(versions) {
    const host = $("feedbackList");
    const latestIds = versions.filter((v) => v.isLatest).map((v) => v.id);
    const open = CS.store.list("comments").filter((c) => latestIds.includes(c.versionId) && c.status === "open");
    if (!open.length) { CS.ui.state(host, "empty", { icon: "✅", msg: "Không có góp ý nào đang mở." }); return; }
    host.innerHTML = open.map((c) => {
      const v = CS.store.get("versions", c.versionId);
      return `<article class="comment"><header class="who">${esc(CS.ui.userName(c.authorId))} · ${esc(v.name)} ${c.internal ? '<span class="badge brand">Nội bộ</span>' : ""}</header>${esc(c.text)}</article>`;
    }).join("");
  }

  $("taskList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-move]"); if (!b) return;
    CS.store.update("tasks", b.dataset.id, { status: b.dataset.move });
    CS.ui.toast("Đã cập nhật trạng thái công việc.", "ok"); render();
  });
  $("taskFilter").addEventListener("change", render);
  render();
})();
