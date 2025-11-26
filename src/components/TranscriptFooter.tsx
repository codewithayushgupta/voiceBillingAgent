// src/components/TranscriptFooter.tsx
import React from "react";
import {
  IonFooter,
  IonCard,
  IonCardContent,
  IonText,
  IonProgressBar,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { documentText, refresh, mic } from "ionicons/icons";
import IconRemount from "./IconRemount";

interface Props {
  speechBuffer: string;
  listening: boolean;
  isProcessing: boolean;
  statusMessage: string;
  onClear: () => void;
  onGenerate: () => void;
  onMicPointerDown: (e: React.PointerEvent) => void;
  onMicPointerUp: (e: React.PointerEvent) => void;
  onMicPointerCancel: (e: React.PointerEvent) => void;
  micBtnRef: React.RefObject<HTMLButtonElement>;
  remountKey: string;
  isPressing: boolean;
}

const TranscriptFooter: React.FC<Props> = ({
  speechBuffer,
  listening,
  isProcessing,
  statusMessage,
  onClear,
  onGenerate,
  onMicPointerDown,
  onMicPointerUp,
  onMicPointerCancel,
  micBtnRef,
  remountKey,
  isPressing,
}) => {
  return (
    <IonFooter className="home-footer" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="transcript-area" style={{ padding: 10 }}>
        <IonCard className="transcript-card" style={{ marginBottom: 8 }}>
          <IonCardContent className="transcript-box-content">
            <IonText color={speechBuffer || listening ? "dark" : "medium"} className="transcript-text">
              {speechBuffer || (listening ? "Listening..." : "Press & hold the mic to start billing...")}
            </IonText>
          </IonCardContent>
        </IonCard>

        <div className="status-indicator" style={{ marginBottom: 8 }}>
          {isProcessing ? (
            <div className="processing-indicator" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <IonText color="medium" className="processing-text">
                Processing...
              </IonText>
              <IonProgressBar type="indeterminate" />
            </div>
          ) : listening ? (
            <div className="listening-indicator" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconRemount keyHint={remountKey}>
                <IonIcon icon={mic} color="danger" className="pulse-icon" />
              </IconRemount>
              <IonText color="medium">Listening...</IonText>
            </div>
          ) : (
            <div className="status-placeholder">&nbsp;</div>
          )}
        </div>
      </div>

      <div className="bottom-action-bar" style={{ display: "flex", padding: 12, gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <IonButton fill="outline" color="medium" onClick={onClear} className="footer-action-btn" style={{ minWidth: 90 }}>
          <IonIcon icon={refresh} slot="start" />
          Clear
        </IonButton>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <button
            id="mic-btn"
            ref={micBtnRef}
            key={remountKey}
            className={`mic-button ${isPressing || listening ? "active" : ""}`}
            onPointerDown={onMicPointerDown}
            onPointerUp={onMicPointerUp}
            onPointerCancel={onMicPointerCancel}
            onPointerLeave={onMicPointerUp}
            onTouchStart={(e) => {
              e.preventDefault();
              onMicPointerDown(e as any);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onMicPointerUp(e as any);
            }}
            style={{
              background: isPressing || listening ? "var(--ion-color-danger)" : "var(--ion-color-success)",
              border: "none",
              borderRadius: "50%",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.18)",
              transition: "all 0.18s ease",
              touchAction: "none",
              fontSize: 36,
              color: "white",
              lineHeight: 1,
            }}
            aria-pressed={isPressing || listening}
            aria-label={isPressing || listening ? "Stop listening" : "Start listening"}
          >
            <span role="img" aria-hidden="false" style={{ fontSize: 36 }}>
              {isPressing || listening ? "⏺️" : "🎤"}
            </span>
          </button>
        </div>

        <IonButton fill="outline" color="light" onClick={onGenerate} className="footer-action-btn" style={{ minWidth: 90 }}>
          <IonIcon icon={documentText} slot="start" />
          Bill
        </IonButton>
      </div>
    </IonFooter>
  );
};

export default TranscriptFooter;
