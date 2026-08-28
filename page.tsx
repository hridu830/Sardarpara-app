import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Home, Moon, Plus, Users, PieChart } from 'lucide-react';

// Supabase ক্লায়েন্ট কানেকশন
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Supabase থেকে রিয়েল ডেটা লোড করা
  useEffect(() => {
    async function fetchMembersData() {
      setLoading(false);
      const { data, error } = await supabase.from('Members').select('*');
      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    }
    fetchMembersData();
  }, []);

  // ডাটাবেসের সঠিক হিসাব
  const totalMembersCount = members.length;
  const totalFundCalculated = members.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* হেডার ও স্বাগতম সেকশন */}
      <div className="bg-emerald-800 text-white p-5 rounded-b-3xl shadow-md">
        <h1 className="text-xl font-bold">Sardarpara</h1>
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">সর্দারপাড়া আমলে সালেহ যুব সংঘ</h2>
          <div className="mt-3 bg-emerald-900/50 p-3 rounded-xl text-sm italic">
            "প্রত্যেক ভালো কাজই সদকা।" — সহীহ বুখারি
          </div>
        </div>
      </div>

      {/* ফান্ড কার্ড সেকশন */}
      <div className="px-4 -mt-6">
        <div className="bg-white p-5 rounded-2xl shadow-lg border">
          <p className="text-gray-500 text-sm">মোট ব্যালেন্স</p>
          <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">
            ৳{totalFundCalculated.toLocaleString('bn-BD')}
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-600 block">মোট সদস্য</span>
              <span className="text-lg font-bold text-emerald-800">
                {totalMembersCount} জন
              </span>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
              <span className="text-xs text-orange-600 block">মোট খরচ</span>
              <span className="text-lg font-bold text-orange-800">৳০</span>
            </div>
          </div>
        </div>
      </div>

      {/* লেনদেন লিস্ট সেকশন */}
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-3">সাম্প্রতিক সদস্য ও লেনদেন</h4>
        
        {loading ? (
          <p className="text-gray-400 text-center py-5">ডেটা লোড হচ্ছে...</p>
        ) : members.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl text-gray-400 border">
            এখনো কোনো সদস্য বা ফান্ড জমা হয়নি।
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="bg-white p-3 rounded-xl border flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.mobile}</p>
                </div>
                <span className="font-bold text-emerald-600">+৳{member.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* স্ক্রিনের সাথে স্থায়ী (Fixed) নেভিগেশন বার */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50 shadow-lg">
        <button className="flex flex-col items-center text-emerald-700">
          <Home size={22} />
          <span className="text-xs font-medium mt-1">হোম</span>
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <Moon size={22} />
          <span className="text-xs font-medium mt-1">নামাজ</span>
        </button>

        <button className="bg-orange-500 text-white p-3 rounded-full -mt-6 shadow-md hover:bg-orange-600 transition-colors">
          <Plus size={24} />
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <Users size={22} />
          <span className="text-xs font-medium mt-1">সদস্য</span>
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <PieChart size={22} />
          <span className="text-xs font-medium mt-1">রিপোর্ট</span>
        </button>
      </nav>
    </div>
  );
}
