'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Calendar, Activity, TrendingUp } from 'lucide-react';
import { AdmissionTrendStat, ConditionStat } from '@/types/analytics';

interface AdmissionsTrendChartProps {
  admissionsTrend?: AdmissionTrendStat[];
  conditionBreakdown?: ConditionStat[];
  totalPatients?: number;
}

const CONDITION_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  Critical: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-[#CF3B3B]' },
  Stable: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-[#00ED64]' },
  'Under Observation': { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-[#E68B00]' },
  Recovered: { bg: 'bg-teal-50', text: 'text-teal-700', bar: 'bg-[#14B8A6]' },
  Chronic: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-[#8B5CF6]' },
  'Routine Checkup': { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-[#3B82F6]' },
};

export function AdmissionsTrendChart({
  admissionsTrend = [],
  conditionBreakdown = [],
  totalPatients = 0,
}: AdmissionsTrendChartProps) {
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('all');

  // Filter admissions data based on selected time range
  const filteredTrend = useMemo(() => {
    if (!admissionsTrend || admissionsTrend.length === 0) return [];

    if (timeRange === 'all') {
      return admissionsTrend;
    }

    const days = timeRange === '7d' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = admissionsTrend.filter((item) => new Date(item.date) >= cutoff);
    return filtered.length > 0 ? filtered : admissionsTrend.slice(-days);
  }, [admissionsTrend, timeRange]);

  const totalInPeriod = useMemo(() => {
    return filteredTrend.reduce((sum, item) => sum + item.admissions, 0);
  }, [filteredTrend]);

  const peakDay = useMemo(() => {
    if (filteredTrend.length === 0) return null;
    return filteredTrend.reduce(
      (max, curr) => (curr.admissions > max.admissions ? curr : max),
      filteredTrend[0]
    );
  }, [filteredTrend]);

  const totalConditionPatients = useMemo(() => {
    const sum = conditionBreakdown.reduce((acc, curr) => acc + curr.count, 0);
    return sum > 0 ? sum : totalPatients || 1;
  }, [conditionBreakdown, totalPatients]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Card (2/3 width): Date-Based Admissions Trend Chart */}
      <div className="lg:col-span-8 bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header Row: Title, Filter Tabs & Icon */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#00A86B]" />
                PATIENT ADMISSIONS TREND (DATE-BASED STATISTICS)
              </span>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {totalInPeriod}{' '}
                  <span className="text-base sm:text-lg font-medium text-gray-500">Admissions</span>
                </span>
                {peakDay && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Peak: {peakDay.admissions} on {peakDay.date}
                  </span>
                )}
              </div>
            </div>

            {/* Time-Range Selector Tabs — Button Capsule with #0C2B24 Linear Gradient & 6px Radius */}
            <div className="flex items-center gap-1 p-1 rounded-[8px] bg-gradient-to-r from-[#0C2B24] via-[#133E34] to-[#0A241E] border border-[#1E5246] shadow-[0_4px_16px_rgba(0,0,0,0.3)] self-start">
              {(
                [
                  { id: 'all', label: 'All Time' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: '7d', label: 'Last 7 Days' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeRange(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-all duration-200 cursor-pointer ${
                    timeRange === tab.id
                      ? 'bg-gradient-to-r from-[#00D084] via-[#05B978] to-[#029E65] text-[#03231A] font-semibold shadow-[0_2px_10px_rgba(0,208,132,0.25)] border border-white/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 pb-2 border-b border-gray-50">
            <span className="text-xs text-gray-500 font-medium">
              Time-series distribution of patient intake and care registration dates
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#00684A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ED64]" />
              <span>Daily Admissions</span>
            </div>
          </div>
        </div>

        {/* Dynamic Area Chart */}
        <div className="h-64 sm:h-72 w-full mt-4">
          {filteredTrend.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#5C768D]">
              No date-based admission data recorded for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredTrend}
                margin={{ top: 15, right: 10, left: -20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="admissionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ED64" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00ED64" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F3F2" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(val) => {
                    try {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    } catch {
                      return val;
                    }
                  }}
                  dy={6}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as AdmissionTrendStat;
                      return (
                        <div className="bg-white rounded-[6px] shadow-lg border border-gray-100 p-3 text-xs min-w-[160px]">
                          <span className="font-semibold text-gray-800 block pb-1 border-b border-gray-100">
                            {item.date}
                          </span>
                          <div className="mt-1.5 flex items-center justify-between text-[#00684A] font-bold">
                            <span>Admissions:</span>
                            <span>{item.admissions} patients</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="admissions"
                  name="Admissions"
                  stroke="#00684A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#admissionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Right Card (1/3 width): Clinical Condition Distribution */}
      <div className="lg:col-span-4 bg-white rounded-[6px] border border-gray-100/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[#00A86B]" />
                CLINICAL CONDITIONS
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  {totalConditionPatients.toLocaleString()}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-semibold bg-[#E8FAF2] text-[#00A86B]">
                  {conditionBreakdown.length} Categories
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-[6px] bg-white border border-[rgba(0,0,0,0.10)] text-[#00A86B] flex items-center justify-center shadow-2xs">
              <Activity className="h-5 w-5 stroke-[2]" />
            </div>
          </div>

          {/* Condition Breakdown Rows with Progress Bars */}
          <div className="mt-5 space-y-3.5">
            {conditionBreakdown.map((item) => {
              const pct = Math.round((item.count / totalConditionPatients) * 100) || 0;
              const config = CONDITION_COLORS[item.condition] || {
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                bar: 'bg-gray-400',
              };

              return (
                <div key={item.condition} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${config.bar}`} />
                      {item.condition}
                    </span>
                    <span className="text-gray-500 font-medium">
                      <strong className="text-gray-900">{item.count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom subtle note */}
        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between mt-4">
          <span>Triage breakdown</span>
          <span className="text-[#00A86B] font-semibold">Real-Time Sync</span>
        </div>
      </div>
    </div>
  );
}
