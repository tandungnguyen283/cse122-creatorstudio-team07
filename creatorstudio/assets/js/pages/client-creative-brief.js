(function () {
  const user = CS.ui.init(); if (!user) return;
  const $ = (id) => document.getElementById(id);
  const esc = CS.ui.esc;
  const SAMPLE = "Tôi cần logo và danh thiếp cho quán cà phê, phong cách tối giản và ấm áp, dành cho sinh viên. Ngân sách 20 triệu, cần xong trước 15/11.";
  let pid = CS.ui.getProjectId(user);
  let editingId = null;
  let aiResult = null;

  if (!pid) {
    /* Chưa có dự án: ẩn form + panel AI (nếu không sẽ là các nút không phản hồi) */
    document.querySelector(".grid.cols-2").hidden = true;
    $("listTitle").hidden = true;
    CS.ui.state($("briefList"), "empty", { icon: "📁", msg: "Bạn chưa có dự án nào. Hãy tạo dự án ở trang Tổng quan trước khi viết brief.", action: '<a class="btn primary" href="client-project-overview.html">Đến Tổng quan dự án</a>' });
    return;
  }
  const isDirty = () => ["fTitle", "fGoal", "fAudience", "fDeliverables", "fStyle", "fBudget", "fDeadline"].some((i) => $(i).value.trim());
  const projectArchived = () => { const p = CS.store.get("projects", pid); return !p || p.status === "archived"; };
  CS.ui.projectPicker(user, $("projectSelect"), (id) => {
    if (id !== pid && isDirty() && !CS.ui.confirm("Biểu mẫu đang có nội dung chưa lưu. Đổi dự án sẽ xóa nội dung này. Tiếp tục?")) {
      $("projectSelect").value = pid; CS.ui.setProjectId(pid); return;
    }
    pid = id; resetForm(); renderList();
  });

  /* ---------- AI-1 ---------- */
  function runAI() {
    const ta = $("freeText"); const err = $("freeTextErr");
    err.textContent = "";
    if (ta.value.trim().length < 25) {
      ta.setAttribute("aria-invalid", "true");
      err.textContent = "Hãy mô tả ít nhất 25 ký tự để AI có đủ dữ liệu.";
      ta.focus(); return;
    }
    ta.setAttribute("aria-invalid", "false");
    const out = $("aiOut");
    $("runAI").disabled = true;
    CS.AI.ui.processing(out);
    CS.AI.structureBrief(ta.value).then((r) => {
      aiResult = r; renderAIResult(r);
    }).catch((e) => {
      CS.AI.ui.failure(out, e);
      out.querySelector("[data-ai-retry]").onclick = runAI;
      out.querySelector("[data-ai-manual]").onclick = () => { out.innerHTML = ""; $("fTitle").focus(); };
      out.querySelector("[data-ai-report]").onclick = CS.AI.ui.report;
    }).finally(() => { $("runAI").disabled = false; });
  }

  function renderAIResult(r) {
    const b = r.brief;
    const rows = [
      ["Mục tiêu", b.goal], ["Đối tượng", b.audience], ["Sản phẩm", b.deliverables.join(", ")],
      ["Phong cách", b.style.join(", ")], ["Ngân sách", b.budget ? b.budget + " VNĐ" : ""], ["Hạn chót", CS.ui.fmtDate(b.deadline)]
    ].map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v ? esc(v) : '<span class="badge warn">Thiếu</span>'}</td></tr>`).join("");
    $("aiOut").innerHTML = `<section class="ai-result">
      ${r.low ? '<p class="alert warn">AI chưa chắc chắn về kết quả này. Hãy kiểm tra kỹ hoặc bổ sung: ' + esc(r.missing.join(", ")) + '.</p>' : ""}
      <div class="table-wrap"><table><tbody>${rows}</tbody></table></div>
      ${CS.AI.ui.why(r.why, r.confidence, r.low)}
      <div class="actions" style="margin-top:.8rem">
        <button class="btn ok sm" id="aiAccept">Chấp nhận</button>
        <button class="btn sm" id="aiEdit">Sửa</button>
        <button class="btn sm" id="aiRegen">Tạo lại</button>
        <button class="btn danger sm" id="aiReject">Từ chối</button>
      </div></section>`;
    /* Hỏi trước khi ghi đè nội dung khách đã nhập tay */
    const applyAI = () => {
      const has = ["fGoal", "fAudience", "fDeliverables", "fStyle", "fBudget", "fDeadline"].some((i) => $(i).value.trim());
      if (has && !CS.ui.confirm("Biểu mẫu đã có nội dung. Ghi đè bằng kết quả AI?")) return false;
      fillForm(aiResult.brief, true); return true;
    };
    $("aiAccept").onclick = () => { if (applyAI()) CS.ui.toast("Đã đưa kết quả AI vào biểu mẫu. Bấm Lưu nháp để lưu.", "ok"); };
    $("aiEdit").onclick = () => { if (applyAI()) $("fTitle").focus(); };
    $("aiRegen").onclick = runAI;
    $("aiReject").onclick = () => { $("aiOut").innerHTML = '<p class="hint" style="color:var(--muted)">Đã bỏ kết quả AI. Bạn có thể nhập lại hoặc điền thủ công.</p>'; aiResult = null; };
  }

  function fillForm(b, fromAI) {
    if (fromAI && !$("fTitle").value) $("fTitle").value = (b.deliverables[0] || "Brief") + " – " + (b.goal || "").slice(0, 30);
    $("fGoal").value = b.goal || "";
    $("fAudience").value = b.audience || "";
    $("fDeliverables").value = (b.deliverables || []).join(", ");
    $("fStyle").value = (b.style || []).join(", ");
    $("fBudget").value = b.budget || "";
    $("fDeadline").value = b.deadline || "";
  }

  /* ---------- Mẫu brief (do quản trị viên cấu hình) ---------- */
  const STD = { "Mục tiêu": "fGoal", "Đối tượng": "fAudience", "Sản phẩm bàn giao": "fDeliverables", "Phong cách": "fStyle", "Ngân sách": "fBudget", "Hạn chót": "fDeadline" };
  const WRAP = Array.from(document.querySelectorAll("[data-tpl]"));
  const WAS_REQUIRED = {};
  WRAP.forEach((w) => { const i = w.querySelector("input, textarea"); WAS_REQUIRED[i.id] = i.hasAttribute("required"); });
  function fillTemplateSelect(selectedId) {
    const list = CS.store.list("templates").filter((t) => t.active || t.id === selectedId);
    $("fTemplate").innerHTML = '<option value="">Đầy đủ (không dùng mẫu)</option>' +
      list.map((t) => `<option value="${t.id}">${esc(t.name)}${t.active ? "" : " (đã tắt)"}</option>`).join("");
    $("fTemplate").value = list.some((t) => t.id === selectedId) ? selectedId : "";
  }
  function applyTemplate(extra) {
    const t = $("fTemplate").value ? CS.store.get("templates", $("fTemplate").value) : null;
    const fields = t ? t.fields : null;
    WRAP.forEach((w) => {
      const on = !fields || fields.includes(w.dataset.tpl);
      const i = w.querySelector("input, textarea");
      w.hidden = !on;
      if (on) { if (WAS_REQUIRED[i.id]) i.setAttribute("required", ""); }
      else { i.removeAttribute("required"); i.value = ""; i.setAttribute("aria-invalid", "false"); w.querySelector(".field-error").textContent = ""; }
    });
    const names = fields ? fields.filter((f) => !STD[f]) : [];
    $("extraFields").innerHTML = names.map((n, k) => `<div class="field"><label for="x${k}">${esc(n)} *</label>
      <input id="x${k}" type="text" required data-extra="${esc(n)}" value="${esc((extra && extra[n]) || "")}"><small class="field-error"></small></div>`).join("");
  }
  $("fTemplate").onchange = () => applyTemplate();
  fillTemplateSelect("");

  /* ---------- Biểu mẫu (C/U) ---------- */
  const form = $("briefForm");
  let mode = "draft";
  form.querySelectorAll("button[type=submit]").forEach((btn) => btn.addEventListener("click", () => { mode = btn.dataset.mode; }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (projectArchived()) { CS.ui.toast("Dự án đã được lưu trữ hoặc không còn tồn tại, không thể thêm brief.", "err"); return; }
    /* Lưu nháp chỉ cần tiêu đề; gửi brief mới kiểm tra đầy đủ */
    let valid;
    if (mode === "draft") {
      form.querySelectorAll(".field-error").forEach((x) => (x.textContent = ""));
      form.querySelectorAll("[aria-invalid]").forEach((x) => x.removeAttribute("aria-invalid"));
      valid = CS.ui.validate(form, (f) => f.id === "fTitle");
    } else valid = CS.ui.validate(form);
    if (!valid) { CS.ui.toast("Vui lòng kiểm tra các trường báo lỗi.", "err"); return; }
    const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);
    const extra = {};
    $("extraFields").querySelectorAll("[data-extra]").forEach((i) => { extra[i.dataset.extra] = i.value.trim(); });
    const data = {
      projectId: pid, title: $("fTitle").value.trim(), goal: $("fGoal").value.trim(), audience: $("fAudience").value.trim(),
      deliverables: split($("fDeliverables").value), style: split($("fStyle").value), budget: $("fBudget").value.trim(),
      deadline: $("fDeadline").value, status: mode === "submit" ? "submitted" : "draft", createdBy: user.id,
      templateId: $("fTemplate").value || null, extra
    };
    if (editingId) CS.store.update("briefs", editingId, data); else CS.store.add("briefs", Object.assign(data, { createdAt: new Date().toISOString() }));
    CS.ui.toast(mode === "submit" ? "Đã gửi brief cho Creative Lead." : "Đã lưu nháp.", "ok");
    resetForm(); renderList();
  });
  $("resetForm").onclick = resetForm;
  function resetForm() {
    form.reset(); editingId = null; $("editBadge").hidden = true; delete $("fDeadline").dataset.orig;
    fillTemplateSelect(""); applyTemplate();
    form.querySelectorAll(".field-error").forEach((e) => (e.textContent = ""));
    form.querySelectorAll("[aria-invalid]").forEach((e) => e.removeAttribute("aria-invalid"));
  }
  $("runAI").onclick = runAI;
  $("fillSample").onclick = () => { $("freeText").value = SAMPLE; $("freeText").focus(); };

  /* ---------- Danh sách (R) + xóa/lưu trữ (D) ---------- */
  let listReq = 0; // bỏ qua kết quả cũ khi đổi dự án nhanh
  function renderList() {
    const host = $("briefList");
    const my = ++listReq;
    CS.ui.state(host, "loading");
    CS.api.list("briefs", (b) => b.projectId === pid && b.status !== "archived").then((rows) => {
      if (my !== listReq) return;
      if (!rows.length) { CS.ui.state(host, "empty", { icon: "📝", msg: "Chưa có brief nào cho dự án này. Hãy tạo brief đầu tiên ở phía trên." }); return; }
      host.innerHTML = '<div class="grid auto">' + rows.map((b) => `
        <article class="card" aria-label="${esc(b.title)}">
          <header style="display:flex;justify-content:space-between;gap:.5rem"><h3>${esc(b.title)}</h3>${CS.ui.statusBadge(b.status)}</header>
          <p>${esc(b.goal)}</p>
          ${b.templateId && CS.store.get("templates", b.templateId) ? `<p class="hint" style="margin:0 0 .3rem"><span class="badge brand">${esc(CS.store.get("templates", b.templateId).name)}</span></p>` : ""}
          <p class="hint" style="color:var(--muted);font-size:.85rem">${b.deadline ? "Hạn: " + CS.ui.fmtDate(b.deadline) : ""}${(b.deliverables || []).length ? " · " + esc(b.deliverables.join(", ")) : ""}${Object.entries(b.extra || {}).map(([k, v]) => " · " + esc(k) + ": " + esc(v)).join("")}</p>
          <div class="actions">
            ${b.status === "draft" || b.status === "rejected" ? `<button class="btn sm" data-act="edit" data-id="${b.id}">Sửa</button><button class="btn sm primary" data-act="submit" data-id="${b.id}">Gửi</button>` : ""}
            ${b.status === "draft" ? `<button class="btn sm danger" data-act="delete" data-id="${b.id}">Xóa</button>` : `<button class="btn sm" data-act="archive" data-id="${b.id}">Lưu trữ</button>`}
          </div>
        </article>`).join("") + "</div>";
    }).catch((e) => { if (my === listReq) CS.ui.state(host, "error", { msg: e.message, onRetry: renderList }); });
  }

  $("briefList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]"); if (!btn) return;
    const id = btn.dataset.id; const act = btn.dataset.act;
    if (act === "edit") {
      const b = CS.store.get("briefs", id); editingId = id;
      fillTemplateSelect(b.templateId); applyTemplate(b.extra);
      $("fTitle").value = b.title; fillForm(b, false); $("fDeadline").dataset.orig = b.deadline || ""; $("editBadge").hidden = false; $("fTitle").focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (act === "submit") {
      CS.store.update("briefs", id, { status: "submitted" }); CS.ui.toast("Đã gửi brief.", "ok"); renderList();
    } else if (act === "delete") {
      if (CS.ui.confirm("Xóa bản nháp này?")) { CS.store.remove("briefs", id); CS.ui.toast("Đã xóa bản nháp."); renderList(); }
    } else if (act === "archive") {
      CS.store.update("briefs", id, { status: "archived" }); CS.ui.toast("Đã lưu trữ brief."); renderList();
    }
  });

  renderList();
})();
