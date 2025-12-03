import React, { useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { cloudDownloadOutline, shareSocialOutline } from "ionicons/icons";

/**
 * Mobile-first Reports page
 * - Assumes global AppHeader exists (so no local IonHeader here)
 * - Uses .page-content to respect app header height
 * - Lightweight inline SVG chart for week sales (no external libs)
 */

/* sample data (daily sales for a week) */
const SAMPLE_WEEK = [
  { day: "Mon", sales: 850 },
  { day: "Tue", sales: 1120 },
  { day: "Wed", sales: 930 },
  { day: "Thu", sales: 1240 },
  { day: "Fri", sales: 980 },
  { day: "Sat", sales: 1620 },
  { day: "Sun", sales: 705 },
];

const Reports: React.FC = () => {
  const [range, setRange] = useState<"today" | "week" | "month">("today");

  const totals = useMemo(() => {
    // In real app, compute from data / API
    const todayTotal = 1540.5;
    const weekTotal = SAMPLE_WEEK.reduce((s, d) => s + d.sales, 0);
    const monthTotal = Math.round(weekTotal * 4.2);
    const billsToday = 8;
    const avgBill = Math.round(todayTotal / (billsToday || 1));
    return { todayTotal, weekTotal, monthTotal, billsToday, avgBill };
  }, []);

  const renderMiniBar = (data: typeof SAMPLE_WEEK) => {
    const max = Math.max(...data.map((d) => d.sales), 1);
    const w = 280;
    const h = 64;
    const gap = 8;
    const barW = (w - gap * (data.length - 1)) / data.length;
    // Build simple rects
    const bars = data.map((d, i) => {
      const bw = barW;
      const bh = Math.round((d.sales / max) * h);
      const x = i * (barW + gap);
      const y = h - bh;
      return (
        <rect
          key={d.day}
          x={x}
          y={y}
          width={bw}
          height={bh}
          rx={3}
          fill="var(--ion-color-primary)"
          opacity={0.92}
        />
      );
    });

    return (
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(0,0)`}>{bars}</g>
      </svg>
    );
  };

  return (
    <IonPage>
      <IonContent className="page-content">
        <div style={{ padding: "10px 14px 20px" }}>
          {/* Top row: title + range selector */}
          <div style={{ display: "flex",  justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 42 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ion-text-color)" }}>Sales Reports</div>
              <div style={{ fontSize: 12, color: "var(--app-muted)", marginTop: 4 }}>Overview & quick insights</div>
            </div>

            <div style={{ width: 200, marginBlock: 20 }}>
              <IonSegment
                value={range}
                onIonChange={(e) => setRange(e.detail.value as any)}
                style={{
                  ["--background" as any]: "transparent",
                  ["--indicator-color" as any]: "var(--ion-color-primary)",
                }}
              >
                <IonSegmentButton
                  value="today"
                  style={{
                    ["--color" as any]: "var(--ion-text-color)",                 // normal text
                    ["--color-checked" as any]: "white",                         // active text
                    ["--border-radius" as any]: "6px",
                    padding: "0 6px",
                    minWidth: 45,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Day</span>
                </IonSegmentButton>

                <IonSegmentButton
                  value="week"
                  style={{
                    ["--color" as any]: "var(--ion-text-color)",
                    ["--color-checked" as any]: "white",
                    ["--border-radius" as any]: "6px",
                    padding: "0 6px",
                    minWidth: 45,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Week</span>
                </IonSegmentButton>

                <IonSegmentButton
                  value="month"
                  style={{
                    ["--color" as any]: "var(--ion-text-color)",
                    ["--color-checked" as any]: "white",
                    ["--border-radius" as any]: "6px",
                    padding: "0 6px",
                    minWidth: 45,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Month</span>
                </IonSegmentButton>
              </IonSegment>
            </div>

          </div>

          {/* KPI card (big) */}
          <IonCard style={{ borderRadius: 14, marginBottom: 14, boxShadow: "0 8px 22px rgba(0,0,0,0.06)" }}>
            <IonCardContent style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 12,
                    background: "rgba(var(--ion-color-primary-rgb),0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 3h18v4H3zM6 10v9M10 7v12M14 4v15M18 12v7" stroke="var(--ion-color-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--app-muted)" }}>
                    {range === "today" ? "Total Sales Today" : range === "week" ? "Total Sales This Week" : "Total Sales This Month"}
                  </div>

                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ion-text-color)", marginTop: 6 }}>
                    {range === "today" ? `₹${totals.todayTotal.toLocaleString()}` : range === "week" ? `₹${totals.weekTotal.toLocaleString()}` : `₹${totals.monthTotal.toLocaleString()}`}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: "var(--ion-color-medium)" }}>
                      Bills: <strong style={{ color: "var(--ion-text-color)" }}>{totals.billsToday}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ion-color-medium)" }}>
                      Avg: <strong style={{ color: "var(--ion-text-color)" }}>₹{totals.avgBill}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* mini chart */}
              <div style={{ marginTop: 12 }}>{renderMiniBar(SAMPLE_WEEK)}</div>
            </IonCardContent>
          </IonCard>

          {/* Two compact KPI tiles */}
          <IonGrid style={{ marginBottom: 12 }}>
            <IonRow>
              <IonCol size="6">
                <IonCard style={{ borderRadius: 12, padding: 10 }}>
                  <IonCardContent style={{ padding: 8 }}>
                    <div style={{ fontSize: 12, color: "var(--app-muted)" }}>Net Profit</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, color: "var(--ion-color-success)" }}>₹4,120</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard style={{ borderRadius: 12, padding: 10 }}>
                  <IonCardContent style={{ padding: 8 }}>
                    <div style={{ fontSize: 12, color: "var(--app-muted)" }}>Top Category</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, color: "var(--ion-text-color)" }}>Groceries</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Recent bills small list */}
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Recent Bills</div>
          <IonList style={{ padding: 0 }}>
            {/* small compact items */}
            <IonItemCompact label="Bill #102" sub="2 items • 09:20 AM" right="₹420" />
            <IonItemCompact label="Bill #101" sub="5 items • 08:50 AM" right="₹760" />
            <IonItemCompact label="Bill #100" sub="1 item • 08:12 AM" right="₹360" />
          </IonList>
        </div>

        {/* floating export/share actions */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{}}>
          <IonFabButton color="primary" aria-label="Export" onClick={() => alert("Exporting CSV...")}>
            <IonIcon icon={cloudDownloadOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

/* Small presentational compact item used above */
const IonItemCompact: React.FC<{ label: string; sub?: string; right?: string }> = ({ label, sub, right }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 8px", borderRadius: 10, marginBottom: 2, background: "var(--app-surface)" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ion-text-color)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--app-muted)", marginTop: 4 }}>{sub}</div>}
      </div>
      {right && <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ion-color-primary)" }}>{right}</div>}
    </div>
  );
};

export default Reports;
