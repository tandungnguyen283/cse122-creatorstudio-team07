/* Thành phần giao diện dùng chung: khung trang, điều hướng theo vai trò, bảo vệ truy cập, toast, modal, kiểm tra hợp lệ. */
(function () {
  const NAV = {
    client: [
      ["client-project-overview.html", "📁", "Tổng quan dự án"],
      ["client-creative-brief.html", "📝", "Creative Brief"],
      ["client-review-versions.html", "🔍", "Duyệt phiên bản"]
    ],
    designer: [
      ["designer-dashboard.html", "🏠", "Bảng điều khiển"],
      ["designer-moodboard.html", "🎨", "Moodboard"],
      ["designer-version-management.html", "🗂️", "Quản lý phiên bản"]
    ],
    lead: [
      ["lead-task-board.html", "📋", "Bảng công việc"],
      ["lead-internal-review.html", "🧐", "Duyệt nội bộ"],
      ["lead-feedback-summary.html", "💬", "Tổng hợp feedback"]
    ],
    admin: [
      ["admin-brief-template-management.html", "🧩", "Template brief"],
      ["admin-user-management.html", "👥", "Người dùng"],
      ["admin-project-settings.html", "⚙️", "Cài đặt dự án"]
    ]
  };
  const ROLE_LABEL = { client: "Khách hàng", designer: "Nhà thiết kế", lead: "Creative Lead", admin: "Quản trị viên" };
  const HOME = { client: "client-project-overview.html", designer: "designer-dashboard.html", lead: "lead-task-board.html", admin: "admin-brief-template-management.html" };

  const ui = {
    NAV, ROLE_LABEL, HOME,

    esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
    fmtDate(d) {
      if (!d) return "—";
      const p = String(d).split("-");
      return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : d;
    },
    /* Ngày theo giờ địa phương (toISOString dùng UTC nên lệch ngày trước 7h sáng ở Việt Nam) */
    today() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    },
    userName(id) { const u = CS.store.get("users", id); return u ? u.name : "—"; },

    /* Bảo vệ truy cập + dựng khung (topbar + sidebar) quanh <main id="main"> */
    init() {
      const body = document.body;
      const role = body.dataset.role;
      if (!role) return null; // trang công khai
      const user = CS.session.user();
      if (!user) { location.replace("login.html?next=" + encodeURIComponent(location.pathname.split("/").pop())); return null; }
      if (user.status !== "active") { CS.session.logout(); location.replace("login.html?disabled=1"); return null; }
      if (user.role !== role) { location.replace("403.html"); return null; }

      const main = document.getElementById("main");
      const page = location.pathname.split("/").pop();
      const links = NAV[role].map(([href, ico, label]) =>
        `<a href="${href}" ${href === page ? 'aria-current="page"' : ""}><span aria-hidden="true">${ico}</span>${label}</a>`).join("");

      const top = document.createElement("header");
      top.className = "topbar";
      top.innerHTML = `
        <a class="brand" href="${HOME[role]}"><span class="brand-mark" aria-hidden="true">C</span>CreatorStudio</a>
        <button class="btn sm nav-toggle" id="navToggle" aria-expanded="false" aria-controls="sidebar">☰ Menu</button>
        <span class="topbar-spacer"></span>
        <div class="user-chip">
          <span class="role-tag">${ROLE_LABEL[role]}</span>
          <span class="name">${ui.esc(user.name)}</span>
          <button class="btn sm" id="logoutBtn">Đăng xuất</button>
        </div>`;
      const skip = document.createElement("a");
      skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Bỏ qua điều hướng";

      const layout = document.createElement("div");
      layout.className = "layout";
      const side = document.createElement("nav");
      side.className = "sidebar"; side.id = "sidebar"; side.setAttribute("aria-label", "Điều hướng chính");
      side.innerHTML = `<h2>${ROLE_LABEL[role]}</h2>${links}`;
      main.parentNode.insertBefore(skip, main);
      main.parentNode.insertBefore(top, main);
      main.parentNode.insertBefore(layout, main);
      layout.appendChild(side); layout.appendChild(main);
      main.setAttribute("tabindex", "-1");

      const host = document.createElement("div");
      host.className = "toast-host"; host.id = "toastHost"; host.setAttribute("aria-live", "polite");
      body.appendChild(host);

      document.getElementById("logoutBtn").onclick = () => { CS.session.logout(); location.href = "login.html"; };
      const tg = document.getElementById("navToggle");
      tg.onclick = () => { const o = side.classList.toggle("open"); tg.setAttribute("aria-expanded", o); };
      ui.wireModals();
      return user;
    },

    toast(msg, type) {
      let host = document.getElementById("toastHost");
      if (!host) { host = document.createElement("div"); host.className = "toast-host"; host.id = "toastHost"; host.setAttribute("aria-live", "polite"); document.body.appendChild(host); }
      const t = document.createElement("div");
      t.className = "toast " + (type || ""); t.textContent = msg;
      host.appendChild(t);
      setTimeout(() => t.remove(), 3200);
    },

    /* Modal truy cập được: đóng bằng Esc / nút / bấm nền, trả focus */
    wireModals() {
      document.querySelectorAll(".modal-back").forEach((m) => {
        m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) ui.closeModal(m.id); });
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") document.querySelectorAll(".modal-back.open").forEach((m) => ui.closeModal(m.id));
      });
    },
    openModal(id) {
      const m = document.getElementById(id);
      ui._last = document.activeElement;
      m.classList.add("open");
      const f = m.querySelector("input, select, textarea, button");
      if (f) f.focus();
    },
    closeModal(id) {
      document.getElementById(id).classList.remove("open");
      if (ui._last && ui._last.focus) ui._last.focus();
    },
    confirm(message) { return window.confirm(message); },

    /* Trạng thái: loading | empty | error */
    state(el, kind, opts) {
      opts = opts || {};
      if (kind === "loading") {
        el.innerHTML = '<div role="status" aria-label="Đang tải"><div class="skeleton lg"></div><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></div>';
      } else if (kind === "empty") {
        el.innerHTML = `<section class="state"><span class="ico" aria-hidden="true">${opts.icon || "📭"}</span><p>${ui.esc(opts.msg || "Chưa có dữ liệu.")}</p>${opts.action || ""}</section>`;
      } else if (kind === "error") {
        el.innerHTML = `<section class="state error" role="alert"><span class="ico" aria-hidden="true">⚠️</span><p>${ui.esc(opts.msg || "Đã xảy ra lỗi.")}</p><button class="btn sm" data-retry>Thử lại</button></section>`;
        const b = el.querySelector("[data-retry]");
        if (b && opts.onRetry) b.onclick = opts.onRetry;
      }
    },

    /* Kiểm tra hợp lệ theo thuộc tính: required, minlength, data-type=email, data-future (ngày không ở quá khứ) */
    validate(form, only) {
      /* only: hàm lọc tùy chọn, chỉ kiểm tra các ô mà only(f) trả về true (dùng cho lưu nháp) */
      let ok = true; let first = null;
      form.querySelectorAll("input, select, textarea").forEach((f) => {
        if (f.type === "checkbox" || f.type === "button" || f.type === "submit") return;
        if (only && !only(f)) return;
        const v = (f.value || "").trim();
        let msg = "";
        if (f.hasAttribute("required") && !v) msg = "Trường này là bắt buộc.";
        else if (v && f.minLength > 0 && v.length < f.minLength) msg = "Cần ít nhất " + f.minLength + " ký tự.";
        else if (v && f.dataset.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Email chưa đúng định dạng.";
        else if (v && f.dataset.future === "1" && v < ui.today() && v !== f.dataset.orig) msg = "Ngày không được ở quá khứ.";
        const err = f.parentElement.querySelector(".field-error");
        if (err) err.textContent = msg;
        f.setAttribute("aria-invalid", msg ? "true" : "false");
        if (msg) { ok = false; if (!first) first = f; }
      });
      if (first) first.focus();
      return ok;
    },

    statusBadge(status) {
      const map = {
        pending: ["Đang chờ duyệt", "warn"], approved: ["Đã duyệt", "ok"], rejected: ["Bị từ chối", "err"],
        changes: ["Cần chỉnh sửa", "info"], archived: ["Đã lưu trữ", ""], draft: ["Bản nháp", ""],
        submitted: ["Đã gửi", "info"], active: ["Đang chạy", "ok"], paused: ["Tạm dừng", "warn"],
        done: ["Hoàn thành", "ok"], open: ["Đang mở", "warn"], resolved: ["Đã xử lý", "ok"],
        disabled: ["Vô hiệu hóa", "err"], published: ["Đã đăng", "ok"], todo: ["Cần làm", ""],
        doing: ["Đang làm", "info"], review: ["Chờ review", "warn"]
      };
      const m = map[status] || [ui.esc(status), ""];
      return `<span class="badge ${m[1]}">${m[0]}</span>`;
    },

    /* Dự án mà người dùng hiện tại được thấy */
    projectsFor(user) {
      return CS.store.list("projects").filter((p) => {
        if (user.ownRole && user.ownRole !== user.role) return true; // đang dùng vai trò khác vai trò gốc: xem toàn bộ
        if (user.role === "client") return p.clientId === user.id;
        if (user.role === "designer") return p.designerId === user.id;
        if (user.role === "lead") return p.leadId === user.id;
        return true;
      });
    },
    getProjectId(user) {
      const list = ui.projectsFor(user);
      let saved = null;
      try { saved = localStorage.getItem("cs_project"); } catch (e) { /* chế độ riêng tư: dùng dự án đầu tiên */ }
      return list.find((p) => p.id === saved) ? saved : (list[0] && list[0].id);
    },
    setProjectId(id) { try { localStorage.setItem("cs_project", id); } catch (e) { /* bỏ qua */ } },
    projectPicker(user, selectEl, onChange) {
      const list = ui.projectsFor(user);
      const cur = ui.getProjectId(user);
      selectEl.innerHTML = list.map((p) => `<option value="${p.id}" ${p.id === cur ? "selected" : ""}>${ui.esc(p.name)}</option>`).join("");
      selectEl.onchange = () => { ui.setProjectId(selectEl.value); onChange(selectEl.value); };
    }
  };

  CS.ui = ui;
})();
