/* Mô phỏng 3 tính năng AI ở Frontend (theo quy tắc + phản hồi định sẵn).
   Mỗi hàm trả Promise; có thể từ chối với { code, message } để minh họa trạng thái AI thất bại / không chắc chắn.
   Thêm ?aifail=1 trên URL để ép lỗi khi demo. */
(function () {
  const L = CS.AIDATA;
  const norm = (s) => s.toLowerCase();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const forced = () => new URLSearchParams(location.search).get("aifail") === "1";
  const uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);

  async function guard(text, minChars) {
    await wait(1100 + Math.random() * 600);
    if (forced()) throw { code: "unavailable", message: "Không thể xử lý yêu cầu lúc này." };
    if (text.trim().length < minChars) throw { code: "insufficient", message: "Không đủ dữ liệu để đưa ra đề xuất. Hãy mô tả chi tiết hơn." };
  }

  const AI = {
    /* AI-1: Brief Structurer – mô tả tự do → brief có cấu trúc */
    async structureBrief(text) {
      await guard(text, 25);
      const t = norm(text);
      const deliverables = Object.keys(L.deliverableWords).filter((k) => t.includes(k)).map((k) => L.deliverableWords[k]);
      const style = Object.keys(L.styleLexicon).filter((k) => t.includes(k));
      /* Đơn vị tiền phải đứng riêng một từ: "10 khách", "3 trang" không được tính là tiền. */
      const budgetM = text.match(/(?<![\p{L}\d])(\d[\d.,]*)\s*(triệu|tr|k|nghìn|vnđ|đ)(?![\p{L}\d])/iu);
      /* Ngày dạng d/m[/yyyy]; dấu "-" chỉ nhận khi phía sau không phải đơn vị như "1-2 tuần". */
      const dateM = text.match(/(?<![\d\/\-.])(\d{1,2})(?:\/|-(?!\d{1,2}\s*(?:tuần|ngày|tháng|năm|người|khách|lần|bản|mẫu|phút|giờ)))(\d{1,2})(?:[\/\-](\d{4}))?(?![\d\/])/iu);
      const audM = text.match(/(?:dành cho|đối tượng|khách hàng là|nhắm tới)\s+([^.,;\n]+)/i);
      /* Tách câu ở dấu chấm không nằm giữa hai chữ số, để "20.5 triệu" không bị cắt đôi. */
      const goalM = text.split(/[.!?\n](?!\d)/)[0].trim();
      let deadline = "";
      if (dateM && +dateM[1] >= 1 && +dateM[1] <= 31 && +dateM[2] >= 1 && +dateM[2] <= 12) {
        const pad = (n) => String(n).padStart(2, "0");
        let y = dateM[3] ? +dateM[3] : new Date().getFullYear();
        deadline = `${y}-${pad(dateM[2])}-${pad(dateM[1])}`;
        /* Không ghi năm mà ngày đã qua: hiểu là năm sau. */
        if (!dateM[3] && deadline < CS.ui.today()) deadline = `${y + 1}-${pad(dateM[2])}-${pad(dateM[1])}`;
      }
      let budget = "";
      if (budgetM) {
        /* "20.000.000" (dấu chấm ngăn nghìn) khác "20.5" / "20,5" (số thập phân) */
        const raw = budgetM[1].replace(/[.,]+$/, "");
        const n = /^\d{1,3}([.,]\d{3})+$/.test(raw) ? parseFloat(raw.replace(/[.,]/g, "")) : parseFloat(raw.replace(",", "."));
        const u = budgetM[2].toLowerCase();
        budget = u.startsWith("tr") || u === "triệu" ? String(Math.round(n * 1000000)) : (u === "k" || u === "nghìn") ? String(Math.round(n * 1000)) : String(Math.round(n));
        budget = Number(budget).toLocaleString("vi-VN");
      }
      const found = { goal: !!goalM, audience: !!audM, deliverables: deliverables.length > 0, style: style.length > 0, budget: !!budget, deadline: !!deadline };
      const hits = Object.values(found).filter(Boolean).length;
      const confidence = Math.round((hits / 6) * 100);
      const missing = Object.keys(found).filter((k) => !found[k]);
      const names = { goal: "mục tiêu", audience: "đối tượng", deliverables: "sản phẩm bàn giao", style: "phong cách", budget: "ngân sách", deadline: "hạn chót" };
      return {
        brief: { goal: goalM, audience: audM ? audM[1].trim() : "", deliverables, style, budget, deadline },
        confidence,
        low: confidence < 50,
        missing: missing.map((k) => names[k]),
        why: [
          deliverables.length ? "Tìm thấy từ khóa sản phẩm: " + deliverables.join(", ") + "." : "Không thấy từ khóa sản phẩm bàn giao.",
          style.length ? "Nhận diện phong cách từ các từ: " + style.join(", ") + "." : "Chưa thấy từ mô tả phong cách.",
          "Mục tiêu lấy từ câu đầu tiên của mô tả.",
          budget ? "Ngân sách quy đổi từ số tiền trong mô tả." : "Không thấy số tiền nên để trống ngân sách."
        ]
      };
    },

    /* AI-2: Feedback Summarizer – danh sách góp ý → action items có ưu tiên */
    async summarizeFeedback(comments) {
      await wait(0);
      const joined = comments.map((c) => c.text).join(" ");
      await guard(joined, 15);
      if (comments.length < 2) throw { code: "insufficient", message: "Không đủ dữ liệu: cần ít nhất 2 góp ý để tổng hợp." };
      const items = comments.map((c) => {
        const t = norm(c.text);
        let priority = "medium";
        if (L.feedbackCues.high.some((w) => t.includes(w))) priority = "high";
        else if (L.feedbackCues.low.some((w) => t.includes(w))) priority = "low";
        const verb = /màu/.test(t) ? "Chỉnh màu sắc" : /chữ|font|khoảng cách/.test(t) ? "Chỉnh chữ/bố cục" : /thêm|bổ sung|cần/.test(t) ? "Bổ sung hạng mục" : "Xem xét góp ý";
        return { commentId: c.id, title: verb + ": " + c.text.replace(/^Nội bộ:\s*/i, "").slice(0, 70), priority, source: c.internal ? "Nội bộ" : "Khách hàng" };
      });
      // gộp trùng theo động từ + ưu tiên
      const merged = [];
      items.forEach((it) => {
        const dup = merged.find((m) => m.title.split(":")[0] === it.title.split(":")[0] && m.priority === it.priority);
        if (dup) { dup.merged = (dup.merged || 1) + 1; dup.title += " · " + it.title.split(": ")[1]; } else merged.push(Object.assign({}, it));
      });
      const confidence = Math.min(95, 55 + comments.length * 8);
      return {
        items: merged,
        confidence,
        low: confidence < 60,
        why: [
          "Độ ưu tiên dựa trên từ khóa như 'sai', 'gấp', 'cần thêm' (cao), 'nên', 'mong' (trung bình).",
          "Các góp ý cùng loại và cùng mức ưu tiên được gộp thành một việc.",
          "Góp ý nội bộ được gắn nhãn riêng để Lead quyết định có gửi khách hay không."
        ]
      };
    },

    /* AI-3: Mood Keyword Assistant – gợi ý từ khóa phong cách */
    async suggestKeywords(input, existing) {
      await guard(input, 3);
      const t = norm(input);
      const direct = Object.keys(L.styleLexicon).filter((k) => t.includes(k));
      let pool = [];
      direct.forEach((k) => { pool = pool.concat(L.styleLexicon[k]); });
      const related = [];
      if (/trà|cà phê|quán|ẩm thực/.test(t)) related.push("ấm áp", "tự nhiên");
      if (/công nghệ|app|startup/.test(t)) related.push("hiện đại", "tối giản");
      if (/triển lãm|nghệ thuật|poster/.test(t)) related.push("rực rỡ", "cổ điển");
      if (/trẻ|sinh viên|gen z/.test(t)) related.push("trẻ trung");
      related.forEach((k) => { pool = pool.concat([k], L.styleLexicon[k] || []); });
      pool = uniq(pool).filter((k) => !(existing || []).includes(k));
      if (!pool.length) throw { code: "uncertain", message: "AI chưa chắc chắn về chủ đề này. Hãy thử thêm từ như 'ấm áp', 'tối giản', 'rực rỡ'." };
      const confidence = direct.length ? 85 : 62;
      return {
        keywords: pool.slice(0, 8),
        confidence,
        low: confidence < 70,
        why: [
          direct.length ? "Khớp trực tiếp với phong cách: " + direct.join(", ") + "." : "Không có từ phong cách trực tiếp, suy ra từ chủ đề trong mô tả.",
          "Loại bỏ các từ khóa đã có trong moodboard."
        ]
      };
    }
  };

  /* Giao diện chung cho khối AI: Nhập → Đang xử lý → Kết quả → Giải thích → Điều khiển */
  AI.ui = {
    processing(el) {
      el.innerHTML = '<div role="status" aria-live="polite"><p><strong>AI đang xử lý…</strong></p><div class="skeleton lg"></div><div class="skeleton"></div><div class="skeleton" style="width:60%"></div></div>';
    },
    failure(el, err, actions) {
      const msg = err && err.message ? err.message : "Không thể xử lý yêu cầu lúc này.";
      el.innerHTML = `<section class="alert warn" role="alert"><strong>${CS.ui.esc(msg)}</strong>
        <div class="actions" style="margin-top:.6rem">${actions || '<button class="btn sm" data-ai-retry>Thử lại</button><button class="btn sm" data-ai-manual>Dùng thủ công</button><button class="btn sm" data-ai-report>Báo cáo</button>'}</div></section>`;
    },
    why(lines, confidence, low) {
      return `<aside class="ai-why"><strong>Vì sao có kết quả này?</strong><ul style="margin:.2rem 0 0 1.1rem;padding:0">${lines.map((l) => "<li>" + CS.ui.esc(l) + "</li>").join("")}</ul></aside>
        <p class="confidence">Độ tin cậy: <span class="bar"><i style="width:${confidence}%"></i></span> ${confidence}% ${low ? '<span class="badge warn">AI chưa chắc chắn</span>' : ""}</p>`;
    },
    report() { CS.ui.toast("Đã ghi nhận báo cáo. Cảm ơn bạn!", "ok"); }
  };

  CS.AI = AI;
})();
