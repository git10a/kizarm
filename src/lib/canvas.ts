import type { RaceRecord } from '../types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatTime(record: RaceRecord): string {
  return `${pad(record.hours)}:${pad(record.minutes)}:${pad(record.seconds)}`;
}

const CATEGORY_SHORT: Record<string, string> = {
  'フルマラソン': 'フル',
  'ハーフマラソン': 'ハーフ',
  '10km': '10km',
  '5km': '5km',
  '3km': '3km',
  'その他': 'その他',
};

export async function generateShareImage(
  record: RaceRecord,
  runnerName: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  // カードと同じ縦長の比率
  const W = 480;
  const H = 560;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const R = 24; // outer corner radius
  const PAD = 20; // outer padding

  // ── 背景（淡いグレー） ──────────────────────────────
  ctx.fillStyle = '#F0EEE8';
  ctx.fillRect(0, 0, W, H);

  // ── SEIKO 黄色ボディ ────────────────────────────────
  const bodyX = PAD;
  const bodyY = PAD;
  const bodyW = W - PAD * 2;
  const bodyH = H - PAD * 2 - 110; // 下部の白エリア分を除く

  const bodyGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX + bodyW, bodyY + bodyH);
  bodyGrad.addColorStop(0, '#FFD400');
  bodyGrad.addColorStop(0.5, '#FFC200');
  bodyGrad.addColorStop(1, '#E8A800');
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, bodyX, bodyY, bodyW, bodyH, R);
  ctx.fill();

  // ボディ影（立体感）
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = 'transparent';
  roundRect(ctx, bodyX, bodyY, bodyW, bodyH, R);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // ── LCD パネル ──────────────────────────────────────
  const lcdMargin = 14;
  const lcdX = bodyX + lcdMargin;
  const lcdY = bodyY + lcdMargin;
  const lcdW = bodyW - lcdMargin * 2;
  const lcdH = bodyH - lcdMargin - 52; // 下にSEIKOロゴバー分残す

  // LCD ベゼル
  ctx.fillStyle = '#6B4800';
  roundRect(ctx, lcdX - 3, lcdY - 3, lcdW + 6, lcdH + 6, 10);
  ctx.fill();

  // LCD 背景
  ctx.fillStyle = '#080800';
  roundRect(ctx, lcdX, lcdY, lcdW, lcdH, 8);
  ctx.fill();

  // スキャンライン
  ctx.save();
  roundRect(ctx, lcdX, lcdY, lcdW, lcdH, 8);
  ctx.clip();
  for (let y = lcdY; y < lcdY + lcdH; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(lcdX, y, lcdW, 1);
  }
  ctx.restore();

  // カテゴリチップ（LCD 内 左上）
  const shortCat = CATEGORY_SHORT[record.category] ?? record.category;
  ctx.font = 'bold 13px monospace';
  const chipW = ctx.measureText(shortCat).width + 16;
  const chipX = lcdX + 12;
  const chipY = lcdY + 14;
  ctx.fillStyle = '#FFC200';
  roundRect(ctx, chipX, chipY - 11, chipW, 20, 4);
  ctx.fill();
  ctx.fillStyle = '#1A0A00';
  ctx.textAlign = 'left';
  ctx.fillText(shortCat, chipX + 8, chipY + 5);

  // タイム（LCD 中央・大）
  const timeStr = formatTime(record);
  ctx.save();
  ctx.shadowColor = '#FFC200';
  ctx.shadowBlur = 28;
  ctx.fillStyle = '#FFC200';
  ctx.font = `bold 72px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(timeStr, W / 2, lcdY + lcdH - 36);
  ctx.restore();

  // FINISH TIME ラベル（LCD 下部）
  ctx.fillStyle = '#2a5a2a';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('FINISH TIME', W / 2, lcdY + lcdH - 14);
  ctx.letterSpacing = '0px';

  // ── ロゴバー（黄色ボディ下部） ──────────────────
  const logoY = lcdY + lcdH + 10;
  ctx.fillStyle = '#2E1A00';
  ctx.font = 'bold 20px "Arial", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  ctx.fillText('KIZARM', W / 2, logoY + 16);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';

  // ── 下部白エリア ────────────────────────────────────
  const infoY = bodyY + bodyH;
  const infoH = H - infoY - PAD;
  const infoX = bodyX;
  const infoW = bodyW;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(infoX, infoY);
  ctx.lineTo(infoX + infoW, infoY);
  ctx.lineTo(infoX + infoW, infoY + infoH - R);
  ctx.arcTo(infoX + infoW, infoY + infoH, infoX + infoW - R, infoY + infoH, R);
  ctx.lineTo(infoX + R, infoY + infoH);
  ctx.arcTo(infoX, infoY + infoH, infoX, infoY + infoH - R, R);
  ctx.lineTo(infoX, infoY);
  ctx.closePath();
  ctx.fill();

  // 枠線
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(infoX, infoY);
  ctx.lineTo(infoX + infoW, infoY);
  ctx.lineTo(infoX + infoW, infoY + infoH - R);
  ctx.arcTo(infoX + infoW, infoY + infoH, infoX + infoW - R, infoY + infoH, R);
  ctx.lineTo(infoX + R, infoY + infoH);
  ctx.arcTo(infoX, infoY + infoH, infoX, infoY + infoH - R, R);
  ctx.lineTo(infoX, infoY);
  ctx.stroke();

  const tx = infoX + 14;
  const ty = infoY + 26;

  // 大会名
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 16px "Arial", sans-serif';
  ctx.textAlign = 'left';
  // 長すぎる場合は省略
  const maxNameWidth = infoW - 28 - (runnerName ? 100 : 0);
  let raceName = record.raceName;
  while (ctx.measureText(raceName).width > maxNameWidth && raceName.length > 0) {
    raceName = raceName.slice(0, -1);
  }
  if (raceName !== record.raceName) raceName += '…';
  ctx.fillText(raceName, tx, ty);

  // 日付
  ctx.fillStyle = '#888888';
  ctx.font = '12px "Arial", sans-serif';
  ctx.fillText(record.date, tx, ty + 20);

  // ランナー名（右）
  if (runnerName) {
    ctx.fillStyle = '#FFC200';
    ctx.font = 'bold 15px "Arial", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(runnerName, infoX + infoW - 14, ty);
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '9px "Arial", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('RUNNER', infoX + infoW - 14, ty + 16);
    ctx.letterSpacing = '0px';
  }

  ctx.textAlign = 'left';

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

// ヘルパー：角丸矩形パス
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export async function downloadShareImage(
  record: RaceRecord,
  runnerName: string
): Promise<void> {
  const blob = await generateShareImage(record, runnerName);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kizarm_${record.category}_${record.date}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function nativeShareImage(
  record: RaceRecord,
  runnerName: string
): Promise<void> {
  const blob = await generateShareImage(record, runnerName);
  const file = new File([blob], `kizarm_${record.category}_${record.date}.png`, {
    type: 'image/png',
  });
  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `${record.category} ${formatTime(record)}`,
      text: `${record.raceName} で ${formatTime(record)} を記録しました！`,
    });
  } else {
    await downloadShareImage(record, runnerName);
  }
}
