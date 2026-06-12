/** Mốc cảnh — tinh chỉnh theo hình ảnh chuỗi frame 8s (192 frames @ 24fps) */
export const CINEMATIC_CHAPTERS = [
  { id: 'approach', start: 0, end: 0.275, label: 'Cầu Rồng' },
  { id: 'fire', start: 0.275, end: 0.625, label: 'Phun lửa' },
  { id: 'riverside', start: 0.625, end: 0.9, label: 'Ven sông' },
  { id: 'students', start: 0.9, end: 1, label: 'Chia sẻ' },
] as const;

export const FIRE_SCENE_START = CINEMATIC_CHAPTERS[1].start;
export const FIRE_SCENE_END = CINEMATIC_CHAPTERS[1].end;
export const RIVERSIDE_SCENE_START = CINEMATIC_CHAPTERS[2].start;
export const STUDENTS_SCENE_START = CINEMATIC_CHAPTERS[3].start;

export const HERO_VIDEO_SRC = '/videos/hero-0612.mp4';
export const HERO_FALLBACK_IMAGE = '/images/hero-frames/frame-001.jpg';
/** Video 0612.mp4 @ 24fps */
export const HERO_VIDEO_FPS = 24;
export const TOTAL_HERO_FRAMES = 192;

export function snapTimeToFps(timeSec: number, fps = HERO_VIDEO_FPS): number {
  const frame = Math.max(0, Math.round(timeSec * fps));
  return frame / fps;
}

export function progressToFrame(progress: number, duration: number, fps = HERO_VIDEO_FPS): number {
  return Math.max(0, Math.round(progress * duration * fps));
}

export function getChapterAtProgress(progress: number) {
  return (
    CINEMATIC_CHAPTERS.find((c) => progress >= c.start && progress < c.end) ??
    CINEMATIC_CHAPTERS[CINEMATIC_CHAPTERS.length - 1]
  );
}

export function fireIntensityAt(progress: number) {
  if (progress < FIRE_SCENE_START) return 0;
  if (progress > FIRE_SCENE_END) {
    const fade = 1 - (progress - FIRE_SCENE_END) / (STUDENTS_SCENE_START - FIRE_SCENE_END + 0.12);
    return Math.max(0, Math.min(1, fade));
  }
  return Math.min(1, (progress - FIRE_SCENE_START) / (FIRE_SCENE_END - FIRE_SCENE_START));
}

