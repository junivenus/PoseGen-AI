
export interface GenerationResult {
  originalUrl: string;
  generatedUrl: string;
  prompt: string;
  timestamp: number;
}

export enum PresetPose {
  JUMPING = "ジャンプしているポーズ",
  SITTING = "座っているポーズ",
  RUNNING = "走っているポーズ",
  WAVING = "手を振っているポーズ",
  PROFILE = "横顔のショット",
  WIDE_SHOT = "背景を含めた引きのショット",
  CLOSE_UP = "顔にクローズアップしたショット",
  DANCING = "踊っているポーズ"
}
