/* Lớp dữ liệu: LocalStorage + API giả lập có độ trễ/lỗi để minh họa trạng thái đang tải/lỗi/rỗng. */
(function () {
  const KEY = "creatorstudio_db_v1";
  const SESSION = "creatorstudio_session_v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const d = raw && JSON.parse(raw);
      if (d && Array.isArray(d.users) && d.users.length) return d;
    } catch (e) { /* bỏ qua, dùng seed */ }
    return JSON.parse(JSON.stringify(CS.SEED));
  }
  let db = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* hết dung lượng: giữ trong bộ nhớ */ }
  }
  function uid(prefix) { return prefix + Math.random().toString(36).slice(2, 8); }

  const store = {
    list(entity) { return (db[entity] || []).slice(); },
    get(entity, id) { return (db[entity] || []).find((x) => x.id === id) || null; },
    add(entity, obj) {
      const rec = Object.assign({ id: uid(entity[0]) }, obj);
      db[entity] = db[entity] || [];
      db[entity].push(rec); save(); return rec;
    },
    update(entity, id, patch) {
      const rec = store.get(entity, id);
      if (!rec) return null;
      Object.assign(rec, patch); save(); return rec;
    },
    remove(entity, id) {
      db[entity] = (db[entity] || []).filter((x) => x.id !== id); save();
    },
    reset() { db = JSON.parse(JSON.stringify(CS.SEED)); save(); },
    clearAll() { db.briefs = []; db.versions = []; db.comments = []; db.tasks = []; save(); }
  };

  /* API giả lập: trả Promise, có thể bật lỗi bằng ?fail=1 trên URL để demo trạng thái lỗi. */
  const api = {
    delay: 450,
    list(entity, filterFn) {
      const forceFail = new URLSearchParams(location.search).get("fail") === "1";
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (forceFail) return reject(new Error("Không thể tải dữ liệu. Vui lòng thử lại."));
          const rows = store.list(entity);
          resolve(filterFn ? rows.filter(filterFn) : rows);
        }, api.delay);
      });
    }
  };

  const session = {
    get() { try { return JSON.parse(localStorage.getItem(SESSION)); } catch (e) { return null; } },
    login(userId, role) {
      const u = store.get("users", userId);
      if (!u) return null;
      localStorage.setItem(SESSION, JSON.stringify({ userId: u.id, role: role || u.role }));
      return u;
    },
    logout() { localStorage.removeItem(SESSION); },
    /* Trả về người dùng với vai trò đang chọn khi đăng nhập (role); ownRole là vai trò gốc của tài khoản. */
    user() {
      const s = session.get(); const u = s ? store.get("users", s.userId) : null;
      return u ? Object.assign({}, u, { ownRole: u.role, role: s.role || u.role }) : null;
    }
  };

  /* Tab khác vừa ghi dữ liệu: nạp lại để lần lưu tiếp theo không ghi đè bằng bản cũ. */
  window.addEventListener("storage", (e) => { if (e.key === KEY) db = load(); });

  CS.store = store; CS.api = api; CS.session = session; CS.uid = uid;
})();
