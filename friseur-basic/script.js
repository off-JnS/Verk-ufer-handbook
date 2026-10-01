/* ==========================================================================
   Haarwerk Winterhude — Basic tier demo
   ~90 lines of vanilla JS: mobile nav toggle, contact form validation
   (simulated submit), footer year. No libraries.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Mobile navigation ----------
     Starter keeps it simple: a plain dropdown under the header. */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };

    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });

    // Close the menu after a link is tapped (one-pager anchors)
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false);
    });
  }

  /* ---------- Contact form validation (simulated submit) ---------- */
  var form = document.getElementById("contact-form");

  if (form) {
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = [
      {
        input: document.getElementById("name"),
        error: document.getElementById("name-error"),
        validate: function (el) {
          return el.value.trim().length >= 2 ? "" : "Bitte geben Sie Ihren Namen an.";
        }
      },
      {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: function (el) {
          if (!el.value.trim()) return "Bitte geben Sie Ihre E-Mail-Adresse an.";
          return EMAIL_RE.test(el.value.trim()) ? "" : "Das sieht nicht nach einer gültigen E-Mail-Adresse aus.";
        }
      },
      {
        input: document.getElementById("message"),
        error: document.getElementById("message-error"),
        validate: function (el) {
          return el.value.trim().length >= 10 ? "" : "Bitte beschreiben Sie kurz Ihr Anliegen (mind. 10 Zeichen).";
        }
      }
    ];

    var showError = function (rule, msg) {
      rule.error.textContent = msg;
      rule.input.closest(".form__field").classList.toggle("has-error", Boolean(msg));
      rule.input.setAttribute("aria-invalid", msg ? "true" : "false");
    };

    rules.forEach(function (rule) {
      rule.input.addEventListener("blur", function () {
        showError(rule, rule.validate(rule.input));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo: no server — remove once a real action is set

      var firstInvalid = null;
      rules.forEach(function (rule) {
        var msg = rule.validate(rule.input);
        showError(rule, msg);
        if (msg && !firstInvalid) firstInvalid = rule.input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      form.querySelectorAll(".form__field, .form__submit").forEach(function (el) {
        el.style.display = "none";
      });
      var success = document.getElementById("form-success");
      if (success) success.hidden = false;
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
