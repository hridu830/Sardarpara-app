'use client';

import React, { useState, useEffect } from 'react';

export default function App() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase Credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  useEffect(() => {
    async function fetchMembersData() {
      setLoading(true);
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/Members?select=*`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setMembers(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchMembersData();
  }, [supabaseUrl, supabaseAnonKey]);

  const totalMembersCount = members.length;
  const totalFundCalculated = members.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* হেডার সেকশন */}
      <div className="bg-emerald-800 text-white p-5 rounded-b-3xl shadow-md">
        <h1 className="text-xl font-bold">Sardarpara</h1>
        <div className="text-center mt-4">
          <h2 className="text-lg font-semibold">
            সর্দারপাড়া আমলে সালেহ্ যুব সংঘ
          </h2>
          <div className="mt-3 bg-emerald-900/50 p-3 rounded-xl text-sm italic">
            "একতার আলো জ্বলুক সর্বদা" - সুধী সুধী
          </div>
        </div>
      </div>

      {/* ফান্ড কার্ড সেকশন */}
      <div className="px-4 -mt-6">
        <div className="bg-white p-5 rounded-2xl shadow-lg border">
          <p className="text-gray-500 text-sm">মোট ব্যালেন্স</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">
            ৳ {totalFundCalculated.toLocaleString('bn-BD')}
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-600 block">মোট সদস্য</span>
              <span className="text-lg font-bold text-emerald-800">
                {totalMembersCount} জন
              </span>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
              <span className="text-xs text-orange-600 block font-semibold">
                মোট খরচ
              </span>
              <span className="text-lg font-bold text-orange-800">৳০</span>
            </div>
          </div>
        </div>
      </div>

      {/* মেম্বার লিস্ট সেকশন */}
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-3">সাম্প্রতিক সদস্য ও অবদান</h4>

        {loading ? (
          <p className="text-gray-400 text-center py-5">ডাটা লোড হচ্ছে...</p>
        ) : members.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl text-gray-400 border">
            এখনো কোনো সদস্য বা জমা তথ্য হয়নি।
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="bg-white p-3 rounded-xl border flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.phone || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">
                    ৳ {Number(member.amount || 0).toLocaleString('bn-BD')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
