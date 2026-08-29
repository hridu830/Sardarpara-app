"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sardarpara-club-data";

type Member = { id: string; name: string; phone: string; mfsNumber: string };
type Income = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  method: string;
  txnId: string;
  note: string;
};
type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
};
type AppState = {
  members: Member[];
  incomes: Income[];
  expenses: Expense[];
  categories: string[];
};

const DEFAULT_STATE: AppState = {
  members: [],
  incomes: [],
  expenses: [],
  categories: [
    "মসজিদ উন্নয়ন",
    "রাস্তা মেরামত",
    "গরীব-দুঃখীদের সাহায্য",
    "ঈদ উপহার সামগ্রী",
    "অন্যান্য",
  ],
};

const MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const bnNum = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
const bnMoney = (n: number) => {
  const r = Math.round(Number(n) || 0);
  return "৳" + bnNum(r.toLocaleString("en-IN"));
};
const bnDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return `${bnNum(d.getDate())} ${MONTHS[d.getMonth()]}, ${bnNum(d.getFullYear())}`;
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

type Tab = "dashboard" | "members" | "incomes" | "expenses";

export default function Page() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [toast, setToast] = useState("");

  // Load from localStorage on mount (browser-only, replaces window.storage)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch (e) {
      console.log("কোনো পুরনো তথ্য পাওয়া যায়নি, নতুন খাতা শুরু হচ্ছে।", e);
    }
    setLoaded(true);
  }, []);

  // Persist on every change, once loaded
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
      showToast("সংরক্ষণে সমস্যা হয়েছে");
    }
  }, [state, loaded]);

  // Sync tab with #hash from the nav links
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace("#", "") as Tab;
      if (["dashboard", "members", "incomes", "expenses"].includes(h)) setTab(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  const totalIncome = (list?: Income[]) =>
    (list ?? state.incomes).reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = (list?: Expense[]) =>
    (list ?? state.expenses).reduce((s, i) => s + Number(i.amount || 0), 0);
  const balance = totalIncome() - totalExpense();
  const memberName = (id: string) => state.members.find((m) => m.id === id)?.name || null;
  const memberTotal = (id: string) =>
    state.incomes.filter((i) => i.memberId === id).reduce((s, i) => s + Number(i.amount || 0), 0);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    state.expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    });
    return map;
  }, [state.expenses]);

  const years = useMemo(() => {
    const set = new Set<string>();
    state.incomes.forEach((i) => set.add((i.date || "").slice(0, 4)));
    state.expenses.forEach((i) => set.add((i.date || "").slice(0, 4)));
    return Array.from(set).filter(Boolean).sort().reverse();
  }, [state.incomes, state.expenses]);

  const filteredIncomes = useMemo(
    () =>
      state.incomes
        .filter((i) => {
          const y = (i.date || "").slice(0, 4);
          const mo = (i.date || "").slice(5, 7);
          return (filterYear === "all" || y === filterYear) && (filterMonth === "all" || mo === filterMonth);
        })
        .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    [state.incomes, filterYear, filterMonth]
  );

  const filteredExpenses = useMemo(
    () =>
      state.expenses
        .filter((i) => {
          const y = (i.date || "").slice(0, 4);
          const mo = (i.date || "").slice(5, 7);
          return (filterYear === "all" || y === filterYear) && (filterMonth === "all" || mo === filterMonth);
        })
        .sort((a, b) => (b.date || "").localeCompare(a.date || "")),
    [state.expenses, filterYear, filterMonth]
  );

  const recent = useMemo(
    () =>
      [
        ...state.incomes.map((i) => ({ ...i, type: "income" as const })),
        ...state.expenses.map((i) => ({ ...i, type: "expense" as const })),
      ]
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
        .slice(0, 6),
    [state.incomes, state.expenses]
  );

  function addMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    setState((s) => ({
      ...s,
      members: [
        ...s.members,
        {
          id: uid(),
          name,
          phone: String(fd.get("phone") || "").trim(),
          mfsNumber: String(fd.get("mfsNumber") || "").trim(),
        },
      ],
    }));
    showToast("সদস্য যুক্ত হয়েছে");
    e.currentTarget.reset();
  }

  function addIncome(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState((s) => ({
      ...s,
      incomes: [
        ...s.incomes,
        {
          id: uid(),
          memberId: String(fd.get("memberId") || ""),
          amount: Number(fd.get("amount")),
          date: String(fd.get("date") || ""),
          method: String(fd.get("method") || ""),
          txnId: String(fd.get("txnId") || "").trim(),
          note: String(fd.get("note") || "").trim(),
        },
      ],
    }));
    showToast("আয় যুক্ত হয়েছে");
    e.currentTarget.reset();
  }

  function addExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let category = String(fd.get("category") || "");
    setState((s) => {
      let categories = s.categories;
      if (category === "__new__") {
        const nc = String(fd.get("newCategory") || "").trim();
        if (!nc) {
          showToast("নতুন খাতের নাম লিখুন");
          return s;
        }
        category = nc;
        if (!categories.includes(nc)) categories = [...categories, nc];
      }
      return {
        ...s,
        categories,
        expenses: [
          ...s.expenses,
          {
            id: uid(),
            category,
            amount: Number(fd.get("amount")),
            date: String(fd.get("date") || ""),
            description: String(fd.get("description") || "").trim(),
          },
        ],
      };
    });
    showToast("ব্যয় যুক্ত হয়েছে");
    e.currentTarget.reset();
    setShowNewCat(false);
  }

  function delMember(id: string) {
    if (!confirm("এই সদস্যকে মুছে ফেলতে চান?")) return;
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }));
  }
  function delIncome(id: string) {
    if (!confirm("এই আয়ের এন্ট্রি মুছে ফেলতে চান?")) return;
    setState((s) => ({ ...s, incomes: s.incomes.filter((m) => m.id !== id) }));
  }
  function delExpense(id: string) {
    if (!confirm("এই ব্যয়ের এন্ট্রি মুছে ফেলতে চান?")) return;
    setState((s) => ({ ...s, expenses: s.expenses.filter((m) => m.id !== id) }));
  }

  const [showNewCat, setShowNewCat] = useState(false);
  const maxCat = Math.max(1, ...Object.values(categoryBreakdown));

  if (!loaded) return <div className="loading">খাতা খোলা হচ্ছে...</div>;

  return (
    <>
      <div className="cover">
        <div className="eyebrow">যুব সংঘের হিসাব খাতা</div>
        <h1>সর্দারপাড়া আমলে সালেহ যুব সংঘ</h1>
        <div className="sub">চাঁদা, ব্যয় ও কল্যাণমূলক কাজের স্বচ্ছ হিসাব</div>
      </div>

      <div className="tabs">
        {(
          [
            ["dashboard", "ড্যাশবোর্ড"],
            ["members", "সদস্যগণ"],
            ["incomes", "চাঁদা / আয়"],
            ["expenses", "ব্যয়ের হিসাব"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <div
            key={id}
            className={`tab ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="content">
        {tab === "dashboard" && (
          <>
            <div className="stamp-wrap">
              <div className="stamp">
                <div className="label">বর্তমান জমা</div>
                <div className="amount">{bnMoney(balance)}</div>
                <div className="tag">সর্দারপাড়া যুব সংঘ</div>
              </div>
            </div>
            <div className="card">
              <div className="stat-row">
                <div className="stat income">
                  <div className="n">{bnMoney(totalIncome())}</div>
                  <div className="l">মোট আয় / চাঁদা</div>
                </div>
                <div className="stat expense">
                  <div className="n">{bnMoney(totalExpense())}</div>
                  <div className="l">মোট ব্যয়</div>
                </div>
                <div className="stat">
                  <div className="n">{bnNum(state.members.length)}</div>
                  <div className="l">মোট সদস্য</div>
                </div>
              </div>
            </div>
            <div className="card">
              <h2>খাত অনুযায়ী ব্যয়</h2>
              {Object.keys(categoryBreakdown).length === 0 ? (
                <div className="empty">এখনো কোনো ব্যয় লেখা হয়নি</div>
              ) : (
                Object.entries(categoryBreakdown).map(([cat, amt]) => (
                  <div className="bar-row" key={cat}>
                    <div className="top">
                      <span>{cat}</span>
                      <span>{bnMoney(amt)}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${((amt / maxCat) * 100).toFixed(0)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="card">
              <h2>সাম্প্রতিক লেনদেন</h2>
              {recent.length === 0 ? (
                <div className="empty">এখনো কোনো লেনদেন নেই</div>
              ) : (
                recent.map((r) => (
                  <div className="ledger-row" key={r.id}>
                    <div className="main">
                      <div className="name">
                        {r.type === "income" ? memberName(r.memberId) || "অজানা সদস্য" : r.category}
                      </div>
                      <div className="meta">
                        {bnDate(r.date)} •{" "}
                        {r.type === "income" ? r.method || "" : r.description || ""}
                      </div>
                    </div>
                    <div className={`amt ${r.type}`}>
                      {r.type === "income" ? "+" : "−"} {bnMoney(r.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "members" && (
          <>
            <div className="card">
              <h2>নতুন সদস্য যুক্ত করুন</h2>
              <form className="form-grid" onSubmit={addMember}>
                <div className="full">
                  <label>নাম *</label>
                  <input required name="name" placeholder="সদস্যের পূর্ণ নাম" />
                </div>
                <div>
                  <label>মোবাইল নম্বর</label>
                  <input name="phone" placeholder="০১xxxxxxxxx" />
                </div>
                <div>
                  <label>বিকাশ/নগদ নম্বর</label>
                  <input name="mfsNumber" placeholder="পেমেন্টের নম্বর" />
                </div>
                <div className="full">
                  <button className="btn btn-primary btn-block" type="submit">
                    সদস্য যুক্ত করুন
                  </button>
                </div>
              </form>
            </div>
            <div className="card">
              <h2>সদস্য তালিকা ({bnNum(state.members.length)} জন)</h2>
              {state.members.length === 0 ? (
                <div className="empty">এখনো কোনো সদস্য যুক্ত হয়নি</div>
              ) : (
                [...state.members]
                  .sort((a, b) => a.name.localeCompare(b.name, "bn"))
                  .map((m) => (
                    <div className="member-card" key={m.id}>
                      <div>
                        <div className="name">{m.name}</div>
                        <div className="meta">
                          {m.phone ? "মোবাইল: " + m.phone : ""}
                          {m.mfsNumber ? " • পেমেন্ট নম্বর: " + m.mfsNumber : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="total">{bnMoney(memberTotal(m.id))}</div>
                        <button className="btn-del" onClick={() => delMember(m.id)}>
                          মুছুন
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {tab === "incomes" && (
          <>
            <div className="card">
              <h2>চাঁদা / আয় যুক্ত করুন</h2>
              {state.members.length === 0 && (
                <div className="notice">
                  আগে &quot;সদস্যগণ&quot; ট্যাব থেকে অন্তত একজন সদস্য যুক্ত করুন।
                </div>
              )}
              <form className="form-grid" onSubmit={addIncome}>
                <div className="full">
                  <label>সদস্য *</label>
                  <select required name="memberId" defaultValue="">
                    <option value="">নির্বাচন করুন</option>
                    {state.members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>টাকার পরিমাণ *</label>
                  <input required type="number" min={1} name="amount" placeholder="যেমন: ৫০০" />
                </div>
                <div>
                  <label>তারিখ *</label>
                  <input required type="date" name="date" />
                </div>
                <div>
                  <label>মাধ্যম *</label>
                  <select required name="method" defaultValue="নগদে হাতে হাতে">
                    <option value="নগদে হাতে হাতে">নগদে হাতে হাতে</option>
                    <option value="বিকাশ">বিকাশ</option>
                    <option value="নগদ (মোবাইল ব্যাংকিং)">নগদ (মোবাইল ব্যাংকিং)</option>
                    <option value="রকেট">রকেট</option>
                    <option value="ব্যাংক">ব্যাংক</option>
                  </select>
                </div>
                <div>
                  <label>ট্রানজেকশন আইডি (যদি থাকে)</label>
                  <input name="txnId" placeholder="TrxID" />
                </div>
                <div className="full">
                  <label>মন্তব্য</label>
                  <input name="note" placeholder="যেমন: আগস্ট মাসের চাঁদা" />
                </div>
                <div className="full">
                  <button className="btn btn-primary btn-block" type="submit">
                    যুক্ত করুন
                  </button>
                </div>
              </form>
            </div>
            <div className="card">
              <h2>আয়ের তালিকা</h2>
              <div className="filters">
                <YearFilter years={years} value={filterYear} onChange={setFilterYear} />
                <MonthFilter value={filterMonth} onChange={setFilterMonth} />
              </div>
              <div className="stat income" style={{ marginBottom: 14 }}>
                <div className="n">{bnMoney(totalIncome(filteredIncomes))}</div>
                <div className="l">এই তালিকার মোট আয়</div>
              </div>
              {filteredIncomes.length === 0 ? (
                <div className="empty">কোনো তথ্য পাওয়া যায়নি</div>
              ) : (
                filteredIncomes.map((r, idx) => (
                  <div className="ledger-row" key={r.id}>
                    <div className="no">{bnNum(filteredIncomes.length - idx)}</div>
                    <div className="main">
                      <div className="name">{memberName(r.memberId) || "অজানা সদস্য"}</div>
                      <div className="meta">
                        {bnDate(r.date)} • {r.method}
                        {r.txnId ? " • ID: " + r.txnId : ""}
                      </div>
                      {r.note && <div className="pill">{r.note}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="amt income">+ {bnMoney(r.amount)}</div>
                      <button className="btn-del" onClick={() => delIncome(r.id)}>
                        মুছুন
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === "expenses" && (
          <>
            <div className="card">
              <h2>ব্যয় যুক্ত করুন</h2>
              <form className="form-grid" onSubmit={addExpense}>
                <div>
                  <label>খাত *</label>
                  <select
                    required
                    name="category"
                    defaultValue={state.categories[0]}
                    onChange={(e) => setShowNewCat(e.target.value === "__new__")}
                  >
                    {state.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__new__">+ নতুন খাত যুক্ত করুন</option>
                  </select>
                </div>
                {showNewCat && (
                  <div>
                    <label>নতুন খাতের নাম</label>
                    <input name="newCategory" placeholder="খাতের নাম লিখুন" />
                  </div>
                )}
                <div>
                  <label>টাকার পরিমাণ *</label>
                  <input required type="number" min={1} name="amount" placeholder="যেমন: ২০০০" />
                </div>
                <div>
                  <label>তারিখ *</label>
                  <input required type="date" name="date" />
                </div>
                <div className="full">
                  <label>বিবরণ</label>
                  <textarea name="description" placeholder="কোথায়, কী কারণে ব্যয় হলো" />
                </div>
                <div className="full">
                  <button className="btn btn-primary btn-block" type="submit">
                    যুক্ত করুন
                  </button>
                </div>
              </form>
            </div>
            <div className="card">
              <h2>ব্যয়ের তালিকা</h2>
              <div className="filters">
                <YearFilter years={years} value={filterYear} onChange={setFilterYear} />
                <MonthFilter value={filterMonth} onChange={setFilterMonth} />
              </div>
              <div className="stat expense" style={{ marginBottom: 14 }}>
                <div className="n">{bnMoney(totalExpense(filteredExpenses))}</div>
                <div className="l">এই তালিকার মোট ব্যয়</div>
              </div>
              {filteredExpenses.length === 0 ? (
                <div className="empty">কোনো তথ্য পাওয়া যায়নি</div>
              ) : (
                filteredExpenses.map((r, idx) => (
                  <div className="ledger-row" key={r.id}>
                    <div className="no">{bnNum(filteredExpenses.length - idx)}</div>
                    <div className="main">
                      <div className="name">{r.category}</div>
                      <div className="meta">
                        {bnDate(r.date)}
                        {r.description ? " • " + r.description : ""}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="amt expense">− {bnMoney(r.amount)}</div>
                      <button className="btn-del" onClick={() => delExpense(r.id)}>
                        মুছুন
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}

function YearFilter({
  years,
  value,
  onChange,
}: {
  years: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="all">সব বছর</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {bnNum(y)}
        </option>
      ))}
    </select>
  );
}

function MonthFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="all">সব মাস</option>
      {MONTHS.map((m, i) => {
        const val = String(i + 1).padStart(2, "0");
        return (
          <option key={val} value={val}>
            {m}
          </option>
        );
      })}
    </select>
  );
}
