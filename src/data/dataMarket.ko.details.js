// Korean detail-page content for the four collections after 다화자 대화 — extracted
// verbatim from Figma (KO / 03–06 상세). Merged into KO.collections by slug.
export const KO_DETAILS = {
  "speaker-separated": {
    "problemPill": {
      "caption": "이런 문제가 있나요?",
      "body": "읽는 음성 말고, 실제로 주고받는 대화가 필요하신가요?"
    },
    "descLines": [
      "대본 없이 주고받는 한국어 다자 대화예요.",
      "겹쳐 말하기, 웃음, 맞장구가 그대로 담겨 있고",
      "화자마다 채널이 하나씩 있어요."
    ],
    "summary": {
      "problems": [
        "실제 턴테이킹으로 풀듀플렉스 음성 모델 학습",
        "말이 겹치는 구간까지 화자 분리",
        "낭독체가 아닌, 감정이 살아 있는 음성"
      ],
      "receive": [
        "화자별 WAV + JSON 전사본",
        "대화 세션 단위",
        "다운로드 링크 · 클라우드 버킷"
      ]
    },
    "useCases": [
      {
        "text": "실제 턴테이킹으로 풀듀플렉스 음성 모델 학습",
        "picto": "picto-turn-taking.svg"
      },
      {
        "text": "말이 겹치는 구간까지 화자 분리",
        "picto": "picto-overlap-diarization.svg"
      },
      {
        "text": "낭독체가 아닌, 감정이 살아 있는 음성",
        "picto": "picto-expressive-voice.svg"
      }
    ],
    "specTables": [
      {
        "title": "규모 · 규격",
        "rows": [
          {
            "label": "총 분량",
            "value": "[보유 시간] · [클립 수]"
          },
          {
            "label": "화자 구성",
            "value": "2~6명, 한국어"
          },
          {
            "label": "장르",
            "value": "토크쇼 · 예능 · 라디오 · [기타 장르]"
          },
          {
            "label": "오디오",
            "value": "화자별 WAV, 48kHz, 화자마다 채널 1개"
          },
          {
            "label": "대화 특성",
            "value": "겹침 발화 비율 · 웃음 · 맞장구 이벤트 표시"
          }
        ]
      },
      {
        "title": "라벨",
        "rows": [
          {
            "label": "기본 제공",
            "value": "전사, 화자 타임라인, 겹침 구간, 웃음 · 맞장구 이벤트"
          },
          {
            "label": "요청 시 추가",
            "value": "감정, 기타 요청 라벨"
          }
        ]
      }
    ],
    "delivery": [
      {
        "label": "파일 형식",
        "value": "화자별 WAV + JSON 전사본"
      },
      {
        "label": "묶음 단위",
        "value": "대화 세션 단위"
      },
      {
        "label": "전달 방식",
        "value": "다운로드 링크 · 클라우드 버킷 (매니페스트 포함)"
      }
    ],
    "rights": [
      {
        "icon": "icon-shield.svg",
        "title": "권리 보유자와 직접 계약",
        "body": "원본을 보유한 제작사와 직접 맺은 계약"
      },
      {
        "icon": "icon-user.svg",
        "title": "출연자 동의 범위",
        "body": "출연자가 목소리의 AI 학습 활용에 동의한 범위 안에서 제공"
      },
      {
        "icon": "icon-face.svg",
        "title": "얼굴 처리 옵션",
        "body": "동의하지 않은 얼굴은 블러, 또는 전체 비식별화"
      },
      {
        "icon": "icon-calendar.svg",
        "title": "비독점 · 기간 한정",
        "body": "계약 기간 안에서 비독점으로 사용"
      },
      {
        "icon": "icon-ban.svg",
        "title": "재현 금지 조항",
        "body": "출연자의 얼굴과 목소리를 재현하는 용도로는 사용 금지"
      }
    ],
    "customBand": {
      "title": "조금 다른 조건이 필요하세요?",
      "body": "화자 수, 장르, 라벨을 바꿔 맞춤 제작으로 요청할 수 있습니다.",
      "button": "이 데이터 기준으로 맞춤 요청"
    }
  },
  "multicam": {
    "problemPill": {
      "caption": "이런 문제가 있나요?",
      "body": "실사 멀티캠 데이터가 부족하신가요?"
    },
    "descLines": [
      "같은 순간을 여러 대의 카메라로 찍은 원본을 시간에 맞춰 정렬했어요.",
      "실제 방송에 쓰인 편집본과 짝을 지어 드려요."
    ],
    "summary": {
      "problems": [
        "여러 시점에서 일관된 영상 생성",
        "원본 → 방송본 쌍으로 편집 결정 학습",
        "여러 각도의 영상으로 사람 3D 복원"
      ],
      "receive": [
        "카메라별 MP4 + 방송 편집본 MP4 + JSON",
        "장면 단위 (카메라 묶음)",
        "다운로드 링크 · 클라우드 버킷"
      ]
    },
    "useCases": [
      {
        "text": "여러 시점에서 일관된 영상 생성",
        "picto": "picto-multi-view.svg"
      },
      {
        "text": "원본 → 방송본 쌍으로 편집 결정 학습",
        "picto": "picto-edit-decision.svg"
      },
      {
        "text": "여러 각도의 영상으로 사람 3D 복원",
        "picto": "picto-3d-reconstruction.svg"
      }
    ],
    "specTables": [
      {
        "title": "규모 · 규격",
        "rows": [
          {
            "label": "총 분량",
            "value": "[보유 시간] · [클립 수]"
          },
          {
            "label": "인원 구성",
            "value": "1~6명 이상, 한국어"
          },
          {
            "label": "장르",
            "value": "토크쇼 · 예능 · 음악 무대 · 중계"
          },
          {
            "label": "카메라 구성",
            "value": "장면당 3~9대 이상, 공유 타임코드로 정렬"
          },
          {
            "label": "영상",
            "value": "카메라별 원본 MP4 + 방송 편집본, 1080p ~ 4K"
          }
        ]
      },
      {
        "title": "라벨",
        "rows": [
          {
            "label": "기본 제공",
            "value": "카메라 ID, 공유 타임코드, 방송본 사용 구간, 3단계 캡션"
          },
          {
            "label": "요청 시 추가",
            "value": "카메라 움직임, 기타 요청 라벨"
          }
        ]
      }
    ],
    "delivery": [
      {
        "label": "파일 형식",
        "value": "카메라별 MP4 + 방송 편집본 MP4 + JSON"
      },
      {
        "label": "묶음 단위",
        "value": "장면 단위 (카메라 묶음)"
      },
      {
        "label": "전달 방식",
        "value": "다운로드 링크 · 클라우드 버킷 (매니페스트 포함)"
      }
    ],
    "rights": [
      {
        "icon": "icon-shield.svg",
        "title": "권리 보유자와 직접 계약",
        "body": "원본을 보유한 제작사와 직접 맺은 계약"
      },
      {
        "icon": "icon-user.svg",
        "title": "출연자 동의 범위",
        "body": "출연자가 초상의 AI 학습 활용에 동의한 범위 안에서 제공"
      },
      {
        "icon": "icon-face.svg",
        "title": "얼굴 처리 옵션",
        "body": "동의하지 않은 얼굴은 블러, 또는 전체 비식별화"
      },
      {
        "icon": "icon-calendar.svg",
        "title": "비독점 · 기간 한정",
        "body": "계약 기간 안에서 비독점으로 사용"
      },
      {
        "icon": "icon-ban.svg",
        "title": "재현 금지 조항",
        "body": "출연자의 얼굴과 목소리를 재현하는 용도로는 사용 금지"
      }
    ],
    "customBand": {
      "title": "조금 다른 조건이 필요하세요?",
      "body": "화자 수, 장르, 라벨을 바꿔 맞춤 제작으로 요청할 수 있습니다.",
      "button": "이 데이터 기준으로 맞춤 요청"
    }
  },
  "motion": {
    "problemPill": {
      "caption": "이런 문제가 있나요?",
      "body": "스튜디오 모션 캡처로는 자연스러운 동작이 안 나오나요?"
    },
    "descLines": [
      "실제 제작 현장에서 나온 자연스러운 동작과 사람 간 상호작용을",
      "휴머노이드 형식으로 리타게팅하고, 시뮬레이션에서 확인했어요."
    ],
    "summary": {
      "problems": [
        "스튜디오 캡처가 놓치는 자연스러운 즉흥 동작",
        "여러 사람 사이의 상호작용",
        "리타게팅 후 시뮬레이션 검증 완료"
      ],
      "receive": [
        "MP4 + 모션 파일(BVH · NPZ) + 로봇 형식 CSV",
        "동작 클립 단위",
        "다운로드 링크 · 클라우드 버킷"
      ]
    },
    "useCases": [
      {
        "text": "스튜디오 캡처가 놓치는 자연스러운 즉흥 동작",
        "picto": "picto-natural-motion.svg"
      },
      {
        "text": "여러 사람 사이의 상호작용",
        "picto": "picto-interaction.svg"
      },
      {
        "text": "리타게팅 후 시뮬레이션 검증 완료",
        "picto": "picto-sim-verified.svg"
      }
    ],
    "specTables": [
      {
        "title": "규모 · 규격",
        "rows": [
          {
            "label": "총 분량",
            "value": "[보유 시간] · [클립 수]"
          },
          {
            "label": "인원 구성",
            "value": "1명 · 2명 · 3명 이상"
          },
          {
            "label": "동작 종류",
            "value": "춤 · 걷기 · 이동 · 상호작용 · 기타"
          },
          {
            "label": "모션",
            "value": "BVH · NPZ + 로봇 형식 CSV (Unitree G1 등)"
          },
          {
            "label": "영상",
            "value": "원본 MP4 1080p ~ 4K, 카메라 1~4대 이상"
          }
        ]
      },
      {
        "title": "라벨",
        "rows": [
          {
            "label": "기본 제공",
            "value": "동작 종류, 텍스트 설명, 시뮬레이션 성공 여부, 원본 클립 ID"
          },
          {
            "label": "요청 시 추가",
            "value": "다른 로봇 형식, 기타 요청 라벨"
          }
        ]
      }
    ],
    "delivery": [
      {
        "label": "파일 형식",
        "value": "MP4 + 모션 파일(BVH · NPZ) + 로봇 형식 CSV"
      },
      {
        "label": "묶음 단위",
        "value": "동작 클립 단위"
      },
      {
        "label": "전달 방식",
        "value": "다운로드 링크 · 클라우드 버킷 (매니페스트 포함)"
      }
    ],
    "rights": [
      {
        "icon": "icon-shield.svg",
        "title": "권리 보유자와 직접 계약",
        "body": "원본을 보유한 제작사와 직접 맺은 계약"
      },
      {
        "icon": "icon-user.svg",
        "title": "출연자 동의 범위",
        "body": "출연자가 동작 데이터의 AI 학습 활용에 동의한 범위 안에서 제공"
      },
      {
        "icon": "icon-face.svg",
        "title": "얼굴 처리 옵션",
        "body": "동의하지 않은 얼굴은 블러, 또는 전체 비식별화"
      },
      {
        "icon": "icon-calendar.svg",
        "title": "비독점 · 기간 한정",
        "body": "계약 기간 안에서 비독점으로 사용"
      },
      {
        "icon": "icon-ban.svg",
        "title": "재현 금지 조항",
        "body": "출연자의 얼굴과 목소리를 재현하는 용도로는 사용 금지"
      }
    ],
    "customBand": {
      "title": "조금 다른 조건이 필요하세요?",
      "body": "화자 수, 장르, 라벨을 바꿔 맞춤 제작으로 요청할 수 있습니다.",
      "button": "이 데이터 기준으로 맞춤 요청"
    }
  },
  "presenter": {
    "problemPill": {
      "caption": "이런 문제가 있나요?",
      "body": "동의를 받은 진행자 영상이 필요하신가요?"
    },
    "descLines": [
      "정면을 보고 제품을 다루며 설명하는 진행자 영상이에요.",
      "모든 출연자에게 AI 학습용 동의를 받았고, 동의서는 클립마다 연결돼 있어요."
    ],
    "summary": {
      "problems": [
        "손과 제품이 닿는 상호작용 학습",
        "동의서가 있는 정면 진행자 영상 생성",
        "제품 소개 영상 생성"
      ],
      "receive": [
        "MP4 + JSON (동의서 ID 포함)",
        "클립 단위",
        "다운로드 링크 · 클라우드 버킷"
      ]
    },
    "useCases": [
      {
        "text": "손과 제품이 닿는 상호작용 학습",
        "picto": "picto-hand-product.svg"
      },
      {
        "text": "동의서가 있는 정면 진행자 영상 생성",
        "picto": "picto-consented-presenter.svg"
      },
      {
        "text": "제품 소개 영상 생성",
        "picto": "picto-product-video.svg"
      }
    ],
    "specTables": [
      {
        "title": "규모 · 규격",
        "rows": [
          {
            "label": "총 분량",
            "value": "[보유 시간] · [클립 수]"
          },
          {
            "label": "출연자",
            "value": "1명 · 2명 · 3명 이상, 전원 AI 학습 동의"
          },
          {
            "label": "제품 종류",
            "value": "뷰티 · 식품 · 가전 · 기타"
          },
          {
            "label": "장소",
            "value": "스튜디오 · 매장 · 야외"
          },
          {
            "label": "영상",
            "value": "원본 MP4 1080p ~ 4K, 카메라 1~3대 이상"
          }
        ]
      },
      {
        "title": "라벨",
        "rows": [
          {
            "label": "기본 제공",
            "value": "제품 종류, 손-제품 접촉 구간, 동의서 ID, 3단계 캡션"
          },
          {
            "label": "요청 시 추가",
            "value": "화면 속 글자 구간, 기타 요청 라벨"
          }
        ]
      }
    ],
    "delivery": [
      {
        "label": "파일 형식",
        "value": "MP4 + JSON (동의서 ID 포함)"
      },
      {
        "label": "묶음 단위",
        "value": "클립 단위"
      },
      {
        "label": "전달 방식",
        "value": "다운로드 링크 · 클라우드 버킷 (매니페스트 포함)"
      }
    ],
    "rights": [
      {
        "icon": "icon-shield.svg",
        "title": "권리 보유자와 직접 계약",
        "body": "원본을 보유한 제작사와 직접 맺은 계약"
      },
      {
        "icon": "icon-user.svg",
        "title": "출연자 동의 범위",
        "body": "출연자 전원의 AI 학습 동의서를 보관하고 클립마다 연결"
      },
      {
        "icon": "icon-face.svg",
        "title": "얼굴 처리 옵션",
        "body": "동의하지 않은 얼굴은 블러, 또는 전체 비식별화"
      },
      {
        "icon": "icon-calendar.svg",
        "title": "비독점 · 기간 한정",
        "body": "계약 기간 안에서 비독점으로 사용"
      },
      {
        "icon": "icon-ban.svg",
        "title": "재현 금지 조항",
        "body": "출연자의 얼굴과 목소리를 재현하는 용도로는 사용 금지"
      }
    ],
    "customBand": {
      "title": "조금 다른 조건이 필요하세요?",
      "body": "화자 수, 장르, 라벨을 바꿔 맞춤 제작으로 요청할 수 있습니다.",
      "button": "이 데이터 기준으로 맞춤 요청"
    }
  }
}
