/**
 * =====================================================
 *  exam-config-2.js — إعدادات الامتحان الثاني
 *  امتحان شامل فيزياء تانية ثانوي ترم ثاني 2026
 * =====================================================
 *
 *  🔒 هذا الملف لا يحتوي على أي إجابات صحيحة.
 *  الإجابات الصحيحة موجودة في Code.gs فقط (على السيرفر).
 *
 * =====================================================
 *
 *  📋 مفتاح الإجابات (للـ Code.gs فقط — لا تضعه هنا):
 *  1-ج(2)  2-د(3)  3-ج(2)  4-ب(1)  5-ج(2)
 *  6-ج(2)  7-د(3)  8-ب(1)  9-أ(0) 10-ب(1)
 * 11-ب(1) 12-ب(1) 13-ب(1) 14-د(3) 15-ج(2)
 * 16-ب(1) 17-ج(2) 18-د(3) 19-ج(2) 20-ب(1)
 *
 * =====================================================
 */

const EXAM_CONFIG = {

  // ─── معلومات الامتحان ──────────────────────────────
  id: "final_exam_2026",
  title: "امتحان شامل فيزياء تانية ثانوي ترم ثاني 2026",
  subtitle: `امتحان شامل على منهج الترم الثاني كامل
  بنفس مستوى امتحان آخر السنة`,
  duration: 120,          // بالدقائق
  passMark: 50,          // درجة النجاح (%)

  // ─── رابط Google Apps Script ────────────────────────
  // ⚠️ هذا الرابط يستقبل الإجابات ويصحح على السيرفر
  sheetsURL: "https://script.google.com/macros/s/AKfycbz87Q37DQbS7KXWIQXGBeNtylFLC89R0Qc1N6IhHDgqKkkBDI7QFZNBnkDQyQIXJwO2/exec",

  // ─── إعداد عرض النموذج ──────────────────────────────
  // true  → يعرض النتيجة الكاملة + الإجابات الصحيحة فور التسليم
  // false → يخفي النتيجة ويعرض رسالة الانتظار حتى ينتهي وقت الامتحان
  showModelAnswer: true,

  // ─── نوع الامتحان ────────────────────────────────────
  mode: "standard",   // "standard" أو "bubble"

  // ─── إعدادات Bubble Sheet (لو mode = "bubble") ──────
  bubble: {
    examImages: ["images/exam_page1.jpg", "images/exam_page2.jpg"],
    totalQuestions: 20,
    optionsPerQ: 4
  },

  // ─── الأسئلة (بدون إجابات صحيحة) ────────────────────

  questions: [
    {
      id: 1,
      text: null,
      image: "images/final_exam/Q1.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 2,
      text: null,
      image: "images/final_exam/Q2.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 3,
      text: null,
      image: "images/final_exam/Q3.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 4,
      text: null,
      image: "images/final_exam/Q4.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 5,
      text: null,
      image: "images/final_exam/Q5.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 6,
      text: null,
      image: "images/final_exam/Q6.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 7,
      text: null,
      image: "images/final_exam/Q7.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 8,
      text: null,
      image: "images/final_exam/Q8.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 9,
      text: null,
      image: "images/final_exam/Q9.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 10,
      text: null,
      image: "images/final_exam/Q10.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 11,
      text: null,
      image: "images/final_exam/Q11.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 12,
      text: null,
      image: "images/final_exam/Q12.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 13,
      text: null,
      image: "images/final_exam/Q13.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 14,
      text: null,
      image: "images/final_exam/Q14.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 15,
      text: null,
      image: "images/final_exam/Q15.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 16,
      text: null,
      image: "images/final_exam/Q16.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 17,
      text: null,
      image: "images/final_exam/Q17.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 18,
      text: null,
      image: "images/final_exam/Q18.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 19,
      text: null,
      image: "images/final_exam/Q19.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    },
    {
      id: 20,
      text: null,
      image: "images/final_exam/Q20.jpg", 
      options: [
        { text: "أ" },
        { text: "ب" },
        { text: "ج" },
        { text: "د" }
      ]
    }
  ]
};