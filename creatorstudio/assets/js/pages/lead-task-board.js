(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  const COLS = [["todo", "Cần làm"], ["doing", "Đang làm"], ["review", "Chờ review"], ["done", "Hoàn thành"]];
  const PRI = { high: ["Cao", "err"], medium: ["Vừa", "warn"], low: ["Thấp", ""] };
  let pid = CS.ui.getProjectId(user);
  let editingId = null;

  const designers = () => CS.store.list("users").filter((u) => u.role === "designer" && u.status === "active");

  if (!pid) { CS.ui.state($("board"), "empty", { icon: "📁", msg: "Bạn chưa phụ trách dự án nào." }); $("newTask").disabled = true; $("briefQueue").hidden = true; return; }
  CS.ui.projectPicker(user, $("projectSelect"), (id) => { pid = id; load(); });
  $("assigneeFilter").innerHTML = '<option value="">Tất cả người nhận</option>' + designers().map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join("");
  $("tAssignee").innerHTML = '<option value="">— Chọn —</option>' + designers().map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join("");

  function load() {
    CS.ui.state($("board"), "loading");
    CS.api.list("tasks", (t) => t.projectId === pid && !t.archived).then(() => { renderBriefs(); renderBoard(); })
      .catch((e) => CS.ui.state($("board"), "error", { msg: e.message, onRetry: load }));
  }

  function renderBriefs() {
    const list = CS.store.list("briefs").filter((b) => b.projectId === pid && b.status === "submitted");
    const host = $("briefList");
    if (!list.length) { host.innerHTML = '<p style="color:var(--muted);margin:0">Không có brief nào đang chờ duyệt.</p>'; return; }
    host.innerHTML = list.map((b) => `<article class="comment"><header style="display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap"><strong>${esc(b.title)}</strong>${CS.ui.statusBadge(b.status)}</header>
      <p style="font-size:.88rem;margin:0">${esc(b.goal)}</p>
      <p style="font-size:.82rem;color:var(--muted);margin:0">${(b.deliverables || []).length ? "Sản phẩm: " + esc(b.deliverables.join(", ")) + " · " : ""}${Object.entries(b.extra || {}).map(([k, v]) => esc(k) + ": " + esc(v) + " · ").join("")}Hạn ${CS.ui.fmtDate(b.deadline)}</p>
      <div class="actions" style="margin-top:.4rem"><button class="btn ok sm" data-brief="approved" data-id="${b.id}">Duyệt brief</button><button class="btn danger sm" data-brief="rejected" data-id="${b.id}">Trả lại</button></div></article>`).join("");
  }
  $("briefList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-brief]"); if (!b) return;
    CS.store.update("briefs", b.dataset.id, { status: b.dataset.brief });
    CS.ui.toast(b.dataset.brief === "approved" ? "Đã duyệt brief." : "Đã trả brief cho khách hàng.", "ok"); renderBriefs();
  });

  function renderBoard() {
    const q = $("q").value.trim().toLowerCase(); const a = $("assigneeFilter").value;
    const all = CS.store.list("tasks").filter((t) => t.projectId === pid && !t.archived);
    const host = $("board");
    if (!all.length) { CS.ui.state(host, "empty", { icon: "📋", msg: "Dự án chưa có công việc nào.", action: '<button class="btn primary" id="emptyNew">Giao việc đầu tiên</button>' }); $("emptyNew").onclick = () => openForm(); return; }
    const rows = all.filter((t) => (!q || t.title.toLowerCase().includes(q)) && (!a || t.assigneeId === a));
    host.innerHTML = '<div class="kanban">' + COLS.map(([key, label], ci) => {
      const items = rows.filter((t) => t.status === key);
      return `<section class="col" aria-label="${label}"><h3>${label} <span class="badge">${items.length}</span></h3>` +
        (items.length ? items.map((t) => card(t, ci)).join("") : '<p style="color:var(--muted);font-size:.85rem;text-align:center;margin:1rem 0">Trống</p>') + "</section>";
    }).join("") + "</div>";
  }

  function card(t, ci) {
    const late = t.status !== "done" && t.due < CS.ui.today();
    const p = PRI[t.priority];
    return `<article class="task"><h4>${esc(t.title)}</h4>
      <footer class="meta"><span>${esc(CS.ui.userName(t.assigneeId))}</span><span>${CS.ui.fmtDate(t.due)} ${late ? '<span class="badge err">Quá hạn</span>' : ""}</span></footer>
      <p style="margin:.4rem 0"><span class="badge ${p[1]}">${p[0]}</span></p>
      <div class="actions">
        ${ci > 0 ? `<button class="btn sm" data-move="${COLS[ci - 1][0]}" data-id="${t.id}" aria-label="Chuyển sang ${COLS[ci - 1][1]}">←</button>` : ""}
        ${ci < 3 ? `<button class="btn sm" data-move="${COLS[ci + 1][0]}" data-id="${t.id}" aria-label="Chuyển sang ${COLS[ci + 1][1]}">→</button>` : ""}
        <button class="btn sm" data-edit="${t.id}">Sửa</button>
        <button class="btn sm danger" data-arch="${t.id}">Lưu trữ</button>
      </div></article>`;
  }

  $("board").addEventListener("click", (e) => {
    const m = e.target.closest("[data-move]"); const ed = e.target.closest("[data-edit]"); const ar = e.target.closest("[data-arch]");
    if (m) { CS.store.update("tasks", m.dataset.id, { status: m.dataset.move }); renderBoard(); }
    else if (ed) openForm(ed.dataset.edit);
    else if (ar) { CS.store.update("tasks", ar.dataset.arch, { archived: true }); CS.ui.toast("Đã lưu trữ công việc."); renderBoard(); }
  });
  $("q").addEventListener("input", renderBoard);
  $("assigneeFilter").addEventListener("change", renderBoard);

  function openForm(id) {
    editingId = id || null;
    const f = $("taskForm"); f.reset();
    f.querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
    f.querySelectorAll("[aria-invalid]").forEach((x) => x.removeAttribute("aria-invalid"));
    $("tkTitle").textContent = id ? "Sửa công việc" : "Giao việc";
    if (id) {
      const t = CS.store.get("tasks", id);
      $("tTitle").value = t.title; $("tAssignee").value = t.assigneeId; $("tPriority").value = t.priority; $("tDue").value = t.due;
      $("tDue").removeAttribute("data-future");
    } else $("tDue").setAttribute("data-future", "1");
    CS.ui.openModal("taskModal");
  }
  $("newTask").onclick = () => openForm();
  $("taskForm").onsubmit = (e) => {
    e.preventDefault();
    if (!CS.ui.validate($("taskForm"))) return;
    const data = { title: $("tTitle").value.trim(), assigneeId: $("tAssignee").value, priority: $("tPriority").value, due: $("tDue").value };
    if (editingId) CS.store.update("tasks", editingId, data);
    else CS.store.add("tasks", Object.assign(data, { projectId: pid, status: "todo", archived: false }));
    CS.ui.closeModal("taskModal"); CS.ui.toast(editingId ? "Đã cập nhật công việc." : "Đã giao việc.", "ok"); renderBoard();
  };

  load();
})();
