// ============================================================
// PROFILE BUILDER — Full 6-Layer Pipeline
// OnboardingPayload → UserProfile
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: ONBOARDING INPUT TYPES
// ─────────────────────────────────────────────────────────────

export type PrimaryGoal = 'build_muscle' | 'get_stronger' | 'lose_fat' | 'general_fitness';
export type Equipment = 'full_gym' | 'barbell' | 'dumbbells' | 'cables' | 'bodyweight' | 'resistance_bands' | 'kettlebells' | 'machines';
export type InjuryArea = 'lower_back' | 'knee' | 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'neck';
export type InjurySeverity = 'avoid_entirely' | 'modify_only';
export type TrainingApproach = 'structured' | 'intuitive' | 'athletic' | 'minimal';
export type TrainingHistory = 'none' | 'some' | 'consistent' | 'advanced';
export type FamiliarMovement = 'squat' | 'hinge' | 'push' | 'pull' | 'carry';
export type CurrentSplit = 'full_body' | 'upper_lower' | 'ppl' | 'body_part' | 'conjugate' | 'other';
export type ProgressStatus = 'progressing' | 'stalled' | 'regressing' | 'just_maintaining';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type WeightLossHistory = 'never_tried' | 'yo_yo' | 'slow_steady' | 'aggressive_past' | 'currently_losing';
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type StressLevel = 'low' | 'moderate' | 'high';
export type FocusArea = 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'legs' | 'glutes';
export type TargetLift = 'bench_press' | 'squat' | 'deadlift' | 'overhead_press' | 'pull_up' | 'general_strength';
export type DeficitAggression = 'aggressive' | 'moderate' | 'slow';
export type GeneralFitnessOrientation = 'health' | 'athleticism' | 'look_better';
export type Sex = 'male' | 'female' | 'other' | null;

export type GoalRefinement =
  | { goal: 'build_muscle'; focusAreas: FocusArea[] }
  | { goal: 'get_stronger'; targetLifts: TargetLift[] }
  | { goal: 'lose_fat'; deficitAggression: DeficitAggression }
  | { goal: 'general_fitness'; orientation: GeneralFitnessOrientation };

export interface OnboardingPayload {
  // ── Stage 1: Hard Constraints ──────────────────────────────
  goal: PrimaryGoal;
  goalRefinement: GoalRefinement;
  equipment: Equipment[];
  injuries: { areas: InjuryArea[]; severity: InjurySeverity } | null;
  schedule: { daysPerWeek: 2 | 3 | 4 | 5 | 6; sessionDurationMinutes: 30 | 45 | 60 | 75 | 90 };

  // ── Stage 2: Training Context ──────────────────────────────
  trainingApproach: TrainingApproach;
  trainingHistory: TrainingHistory;
  returningFromBreak: boolean;

  // ── Stage 3: Adaptive Paths (path-dependent) ───────────────
  beginnerPath?: {
    familiarMovements: FamiliarMovement[];
  };
  intermediateAdvancedPath?: {
    currentSplit: CurrentSplit;
    progressStatus: ProgressStatus;
    workingWeights?: Partial<Record<TargetLift, number>>; // kg
  };
  fatLossPath?: {
    activityOutsideGym: ActivityLevel;
    weightLossHistory: WeightLossHistory;
  };

  // ── Stage 4: Enrichment (optional) ────────────────────────
  enrichment?: {
    sleepQuality?: SleepQuality;
    stressLevel?: StressLevel;
    activityLevel?: ActivityLevel; // non-fat-loss only
    age?: number;
    weight?: number; // kg
    height?: number; // cm
    sex?: Sex;
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 2: USER PROFILE OUTPUT TYPES
// ─────────────────────────────────────────────────────────────

export type ExperienceLevel = 'novice' | 'intermediate' | 'advanced';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core';
export type SplitArchitecture = 'full_body' | 'upper_lower' | 'ppl' | 'push_pull' | 'body_part';
export type PeriodizationModel = 'linear' | 'undulating' | 'block' | 'conjugate';
export type ProgressionScheme = 'weekly_linear' | 'biweekly_linear' | 'double_progression' | 'wave_loading';

/** Per-muscle weekly set targets derived from RP/Israetel-style landmarks */
export interface VolumeLandmarks {
  mev: number; // Minimum Effective Volume (sets/week)
  mav: number; // Maximum Adaptive Volume (sets/week)
  mrv: number; // Maximum Recoverable Volume (sets/week)
  startingVolume: number; // First mesocycle starting point
}

export interface IntensityProfile {
  repRangeMin: number;
  repRangeMax: number;
  rirTarget: number; // Reps In Reserve at working sets
  loadZoneMin: number; // % of estimated 1RM
  loadZoneMax: number;
  estimated1RM?: Partial<Record<TargetLift, number>>; // kg, if working weights provided
}

export interface ConstraintSet {
  equipment: Equipment[];
  blockedExercises: string[]; // exercise IDs hard-excluded (injury severity: avoid)
  modifiedExercises: string[]; // exercise IDs requiring substitution/cue (modify_only)
  injuryAreas: InjuryArea[];
  injurySeverity: InjurySeverity | null;
  weeklyTimeBudgetMinutes: number;
  maxExercisesPerSession: number;
  daysPerWeek: number;
  sessionDurationMinutes: number;
}

export interface GoalDecomposition {
  primaryGoal: PrimaryGoal;
  splitArchitecture: SplitArchitecture;
  periodizationModel: PeriodizationModel;
  progressionScheme: ProgressionScheme;
  priorityMuscleGroups: MuscleGroup[];
  targetLifts: TargetLift[];
  mesocycleLengthWeeks: number;
  deloadFrequencyWeeks: number;
  programStyle: TrainingApproach;
}

export interface RecoveryProfile {
  recoveryCapacity: 'low' | 'medium' | 'high';
  mrvModifier: number; // multiplier on MRV ceilings (0.7–1.2)
  progressionRateModifier: number; // multiplier on load/rep progression speed
  detrainingAdjustment: boolean;
  notes: string[];
}

export interface UserProfile {
  experienceLevel: ExperienceLevel;
  goal: PrimaryGoal;
  constraints: ConstraintSet;
  volumeLandmarks: Record<MuscleGroup, VolumeLandmarks>;
  intensityProfile: IntensityProfile;
  goalDecomposition: GoalDecomposition;
  recoveryProfile: RecoveryProfile;
  movementCompetency: Record<FamiliarMovement, boolean>;  // ← add
  tdeeModifier: number;                             // ← add
  bmi?: number;                             // ← add
  confidenceScore: number;  // 0–1; seeds alpha-blend in adaptive engine
  createdAt: string;
  rawPayload: OnboardingPayload;
}

// ─────────────────────────────────────────────────────────────
// SECTION 3: CONSTANTS
// ─────────────────────────────────────────────────────────────

/**
 * Base MEV / MAV / MRV per muscle group per experience level (sets/week).
 * Based on RP Hypertrophy guidelines. Adaptive engine will tune these over time.
 */
const VOLUME_LANDMARKS_BASE: Record<ExperienceLevel, Record<MuscleGroup, { mev: number; mav: number; mrv: number }>> = {
  novice: {
    chest: { mev: 4, mav: 8, mrv: 12 },
    back: { mev: 4, mav: 8, mrv: 14 },
    shoulders: { mev: 4, mav: 8, mrv: 12 },
    biceps: { mev: 2, mav: 6, mrv: 10 },
    triceps: { mev: 2, mav: 6, mrv: 10 },
    quads: { mev: 4, mav: 8, mrv: 12 },
    hamstrings: { mev: 3, mav: 6, mrv: 10 },
    glutes: { mev: 3, mav: 6, mrv: 10 },
    calves: { mev: 2, mav: 6, mrv: 10 },
    core: { mev: 2, mav: 4, mrv: 8 },
  },
  intermediate: {
    chest: { mev: 6, mav: 12, mrv: 18 },
    back: { mev: 6, mav: 14, mrv: 20 },
    shoulders: { mev: 6, mav: 12, mrv: 18 },
    biceps: { mev: 4, mav: 10, mrv: 16 },
    triceps: { mev: 4, mav: 10, mrv: 16 },
    quads: { mev: 6, mav: 12, mrv: 18 },
    hamstrings: { mev: 4, mav: 10, mrv: 16 },
    glutes: { mev: 4, mav: 10, mrv: 16 },
    calves: { mev: 4, mav: 10, mrv: 16 },
    core: { mev: 4, mav: 8, mrv: 12 },
  },
  advanced: {
    chest: { mev: 8, mav: 16, mrv: 22 },
    back: { mev: 8, mav: 18, mrv: 25 },
    shoulders: { mev: 8, mav: 16, mrv: 22 },
    biceps: { mev: 6, mav: 14, mrv: 20 },
    triceps: { mev: 6, mav: 14, mrv: 20 },
    quads: { mev: 8, mav: 16, mrv: 22 },
    hamstrings: { mev: 6, mav: 14, mrv: 20 },
    glutes: { mev: 6, mav: 14, mrv: 20 },
    calves: { mev: 6, mav: 14, mrv: 20 },
    core: { mev: 6, mav: 12, mrv: 16 },
  },
};

/** Base intensity profile per primary goal */
const INTENSITY_PROFILES_BASE: Record<PrimaryGoal, Omit<IntensityProfile, 'estimated1RM'>> = {
  build_muscle: { repRangeMin: 6, repRangeMax: 20, rirTarget: 2, loadZoneMin: 65, loadZoneMax: 80 },
  get_stronger: { repRangeMin: 1, repRangeMax: 6, rirTarget: 1, loadZoneMin: 80, loadZoneMax: 95 },
  lose_fat: { repRangeMin: 10, repRangeMax: 20, rirTarget: 2, loadZoneMin: 55, loadZoneMax: 75 },
  general_fitness: { repRangeMin: 8, repRangeMax: 15, rirTarget: 2, loadZoneMin: 60, loadZoneMax: 75 },
};

/**
 * Injury area → contraindicated exercise category IDs.
 * In production, these map to your exercise library IDs.
 */
const INJURY_BLOCKLIST: Record<InjuryArea, string[]> = {
  lower_back: ['barbell_row', 'conventional_deadlift', 'good_morning', 'jefferson_curl', 'hyperextension', 'roman_deadlift'],
  knee: ['barbell_squat', 'leg_press', 'lunge', 'leg_extension', 'step_up', 'box_jump'],
  shoulder: ['overhead_press', 'lateral_raise', 'upright_row', 'behind_neck_press', 'dips', 'arnold_press'],
  elbow: ['close_grip_bench', 'skull_crusher', 'tricep_dip', 'barbell_curl', 'ez_bar_curl'],
  wrist: ['barbell_curl', 'wrist_curl', 'front_squat', 'clean_and_press', 'farmers_carry'],
  hip: ['barbell_squat', 'hip_thrust', 'leg_press', 'lunge', 'sumo_deadlift'],
  neck: ['shrug', 'neck_curl', 'behind_neck_press', 'overhead_press'],
};

/** Valid split architectures per training days/week */
const SPLIT_OPTIONS: Record<number, SplitArchitecture[]> = {
  2: ['full_body'],
  3: ['full_body', 'upper_lower'],
  4: ['upper_lower', 'push_pull'],
  5: ['upper_lower', 'ppl', 'body_part'],
  6: ['ppl', 'push_pull', 'body_part'],
};

// ─────────────────────────────────────────────────────────────
// SECTION 4: LAYER 1 — INPUT VALIDATION
// ─────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validatePayload(p: OnboardingPayload): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!p.goal) errors.push('Missing required field: goal');
  if (!p.goalRefinement) errors.push('Missing required field: goalRefinement');
  if (!p.equipment || p.equipment.length === 0) errors.push('Missing required field: equipment');
  if (!p.schedule) errors.push('Missing required field: schedule');
  if (!p.trainingHistory) errors.push('Missing required field: trainingHistory');
  if (p.returningFromBreak === undefined) errors.push('Missing required field: returningFromBreak');

  // Goal ↔ refinement consistency
  if (p.goalRefinement && p.goalRefinement.goal !== p.goal) {
    errors.push(`goalRefinement.goal ("${p.goalRefinement.goal}") does not match primary goal ("${p.goal}")`);
  }

  // build_muscle: focus areas ↔ injury conflict
  if (p.goalRefinement?.goal === 'build_muscle' && p.injuries) {
    const { focusAreas } = p.goalRefinement as { goal: 'build_muscle'; focusAreas: FocusArea[] };
    const injury = p.injuries.areas;
    if (focusAreas.includes('shoulders') && injury.includes('shoulder')) {
      warnings.push('Focus area "shoulders" conflicts with shoulder injury — shoulder volume will be severely limited');
    }
    if ((focusAreas.includes('legs') || focusAreas.includes('glutes')) && (injury.includes('knee') || injury.includes('hip'))) {
      warnings.push('Lower body focus conflicts with knee/hip injury — exercise pool will be heavily restricted');
    }
    if (focusAreas.includes('arms') && (injury.includes('elbow') || injury.includes('wrist'))) {
      warnings.push('Arms focus conflicts with elbow/wrist injury — isolation exercises will be limited');
    }
  }

  // get_stronger: lift count vs days conflict
  if (p.goalRefinement?.goal === 'get_stronger') {
    const { targetLifts } = p.goalRefinement as { goal: 'get_stronger'; targetLifts: TargetLift[] };
    const specificLifts = targetLifts.filter(l => l !== 'general_strength');
    if (specificLifts.length > p.schedule.daysPerWeek) {
      warnings.push(
        `${specificLifts.length} target lifts selected but only ${p.schedule.daysPerWeek} training days — ` +
        'some lifts will share sessions'
      );
    }
  }

  // Path consistency
  if (p.trainingHistory === 'none' && p.intermediateAdvancedPath) {
    warnings.push('Training history is "none" but intermediate/advanced path data was provided — beginner path will be used');
  }
  if ((p.trainingHistory === 'consistent' || p.trainingHistory === 'advanced') && p.beginnerPath && !p.intermediateAdvancedPath) {
    warnings.push('Training history suggests intermediate/advanced but only beginner path data was provided');
  }

  // Enrichment range checks
  if (p.enrichment?.age !== undefined) {
    if (p.enrichment.age < 13 || p.enrichment.age > 100) errors.push('Age out of valid range (13–100)');
  }
  if (p.enrichment?.weight !== undefined && p.enrichment.weight < 30) {
    warnings.push('Weight appears unusually low — confirm units are kg');
  }
  if (p.enrichment?.height !== undefined && (p.enrichment.height < 100 || p.enrichment.height > 250)) {
    warnings.push('Height appears out of range (100–250 cm)');
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─────────────────────────────────────────────────────────────
// SECTION 5: LAYER 2 — ATTRIBUTE INFERENCE
// ─────────────────────────────────────────────────────────────

interface InferredAttributes {
  experienceLevel: ExperienceLevel;
  activePath: 'beginner' | 'intermediate' | 'advanced';
  isFatLossPath: boolean;
  movementCompetency: Record<FamiliarMovement, boolean>;
  tdeeModifier: number; // 0.85–1.1 multiplier on volume/recovery tolerance
  bmi?: number;
}

function inferAttributes(p: OnboardingPayload): InferredAttributes {
  // Experience level from training history
  const expMap: Record<TrainingHistory, ExperienceLevel> = {
    none: 'novice',
    some: 'novice',
    consistent: 'intermediate',
    advanced: 'advanced',
  };
  const experienceLevel = expMap[p.trainingHistory];

  const activePath = experienceLevel === 'novice' ? 'beginner'
    : experienceLevel === 'intermediate' ? 'intermediate'
      : 'advanced';

  // Fat loss path runs alongside A or B
  const isFatLossPath = p.goal === 'lose_fat' || !!p.fatLossPath;

  // Movement competency — beginners only; others default all-true
  const allMovements: FamiliarMovement[] = ['squat', 'hinge', 'push', 'pull', 'carry'];
  const movementCompetency = Object.fromEntries(
    allMovements.map(m => [m, p.beginnerPath ? p.beginnerPath.familiarMovements.includes(m) : true])
  ) as Record<FamiliarMovement, boolean>;

  // TDEE modifier — activity level from fat loss path or enrichment
  const tdeeModifierMap: Record<ActivityLevel, number> = {
    sedentary: 0.85,
    lightly_active: 0.95,
    moderately_active: 1.00,
    very_active: 1.10,
  };
  const activityLevel = p.fatLossPath?.activityOutsideGym
    ?? p.enrichment?.activityLevel
    ?? 'lightly_active';
  const tdeeModifier = tdeeModifierMap[activityLevel];

  // BMI (optional)
  let bmi: number | undefined;
  if (p.enrichment?.weight && p.enrichment?.height) {
    const hm = p.enrichment.height / 100;
    bmi = Math.round((p.enrichment.weight / (hm * hm)) * 10) / 10;
  }

  return { experienceLevel, activePath, isFatLossPath, movementCompetency, tdeeModifier, bmi };
}

// ─────────────────────────────────────────────────────────────
// SECTION 6: LAYER 3 — CONSTRAINT RESOLUTION
// ─────────────────────────────────────────────────────────────

function resolveConstraints(p: OnboardingPayload): ConstraintSet {
  const blocked: string[] = [];
  const modified: string[] = [];

  if (p.injuries && p.injuries.areas.length > 0) {
    p.injuries.areas.forEach(area => {
      const contraindicated = INJURY_BLOCKLIST[area] ?? [];
      if (p.injuries!.severity === 'avoid_entirely') {
        blocked.push(...contraindicated);
      } else {
        modified.push(...contraindicated);
      }
    });
  }

  // Deduplicate; modified list cannot overlap blocked
  const uniqueBlocked = [...new Set(blocked)];
  const uniqueModified = [...new Set(modified.filter(e => !uniqueBlocked.includes(e)))];

  // Time budget
  const weeklyTimeBudgetMinutes = p.schedule.daysPerWeek * p.schedule.sessionDurationMinutes;

  // Max exercises per session
  // Formula: (session minutes - 10 min warmup/cooldown) / ~12 min avg per exercise
  const workingMinutes = p.schedule.sessionDurationMinutes - 10;
  const maxExercisesPerSession = Math.max(2, Math.floor(workingMinutes / 12));

  return {
    equipment: p.equipment,
    blockedExercises: uniqueBlocked,
    modifiedExercises: uniqueModified,
    injuryAreas: p.injuries?.areas ?? [],
    daysPerWeek: p.schedule.daysPerWeek,            // ← add
    sessionDurationMinutes: p.schedule.sessionDurationMinutes,
    injurySeverity: p.injuries?.severity ?? null,
    weeklyTimeBudgetMinutes,
    maxExercisesPerSession,
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 7: LAYER 5b — RECOVERY PROFILE
// (computed before volume landmarks — MRV depends on it)
// ─────────────────────────────────────────────────────────────

function buildRecoveryProfile(p: OnboardingPayload): RecoveryProfile {
  const notes: string[] = [];
  let mrvModifier = 1.0;
  let progressionRateModifier = 1.0;

  // Sleep quality modifier
  const sleepMods: Record<SleepQuality, number> = {
    poor: 0.75,
    fair: 0.90,
    good: 1.00,
    excellent: 1.10,
  };
  if (p.enrichment?.sleepQuality) {
    const m = sleepMods[p.enrichment.sleepQuality];
    mrvModifier *= m;
    if (m < 1.0) notes.push(`Poor/fair sleep quality — MRV ceiling reduced (×${m})`);
    if (m > 1.0) notes.push(`Excellent sleep — slight MRV bonus (×${m})`);
  }

  // Stress level modifier
  const stressMods: Record<StressLevel, number> = {
    low: 1.05,
    moderate: 1.00,
    high: 0.85,
  };
  if (p.enrichment?.stressLevel) {
    const m = stressMods[p.enrichment.stressLevel];
    mrvModifier *= m;
    if (m < 1.0) notes.push(`High stress — MRV ceiling further reduced (×${m})`);
  }

  // Age modifier (>50)
  if (p.enrichment?.age && p.enrichment.age > 50) {
    const ageMod = Math.max(0.75, 1 - (p.enrichment.age - 50) * 0.01);
    mrvModifier *= ageMod;
    progressionRateModifier *= 0.85;
    notes.push(`Age ${p.enrichment.age} applies recovery penalty (×${ageMod.toFixed(2)})`);
  }

  // Stalled/regressing intermediate/advanced → inferred fatigue
  const ps = p.intermediateAdvancedPath?.progressStatus;
  if (ps === 'stalled' || ps === 'regressing') {
    mrvModifier *= 0.85;
    notes.push('Stalled/regressing progress — accumulated fatigue likely, MRV reduced');
  }

  // Returning from break → accelerated rebound progression
  if (p.returningFromBreak) {
    progressionRateModifier *= 1.30;
    notes.push('Returning from break — faster progression rate expected (×1.3)');
  }

  // Fat loss path — weight loss history modifiers
  if (p.fatLossPath) {
    const histMods: Record<WeightLossHistory, number> = {
      never_tried: 1.00,
      yo_yo: 0.85,
      slow_steady: 1.00,
      aggressive_past: 0.90,
      currently_losing: 0.95,
    };
    const m = histMods[p.fatLossPath.weightLossHistory];
    mrvModifier *= m;
    if (m < 1.0) notes.push(`Weight loss history "${p.fatLossPath.weightLossHistory}" — metabolic adaptation risk, MRV reduced`);
  }

  // Derive recovery capacity bucket
  let recoveryCapacity: 'low' | 'medium' | 'high';
  if (mrvModifier < 0.85) recoveryCapacity = 'low';
  else if (mrvModifier >= 1.05) recoveryCapacity = 'high';
  else recoveryCapacity = 'medium';

  return {
    recoveryCapacity,
    mrvModifier: Math.round(mrvModifier * 100) / 100,
    progressionRateModifier: Math.round(progressionRateModifier * 100) / 100,
    detrainingAdjustment: p.returningFromBreak,
    notes,
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 8: LAYER 4 — VOLUME LANDMARK CALCULATION
// ─────────────────────────────────────────────────────────────

/** Maps goal refinement to which muscles deserve priority starting volume */
function derivePriorityMuscles(p: OnboardingPayload): MuscleGroup[] {
  if (p.goalRefinement.goal === 'build_muscle') {
    const focusMap: Record<FocusArea, MuscleGroup[]> = {
      chest: ['chest', 'triceps'],
      back: ['back', 'biceps'],
      shoulders: ['shoulders'],
      arms: ['biceps', 'triceps'],
      core: ['core'],
      legs: ['quads', 'hamstrings', 'calves'],
      glutes: ['glutes', 'hamstrings'],
    };
    const { focusAreas } = p.goalRefinement as { goal: 'build_muscle'; focusAreas: FocusArea[] };
    return [...new Set(focusAreas.flatMap(f => focusMap[f]))];
  }

  if (p.goalRefinement.goal === 'get_stronger') {
    const liftMap: Partial<Record<TargetLift, MuscleGroup[]>> = {
      bench_press: ['chest', 'triceps', 'shoulders'],
      squat: ['quads', 'glutes'],
      deadlift: ['back', 'hamstrings', 'glutes'],
      overhead_press: ['shoulders', 'triceps'],
      pull_up: ['back', 'biceps'],
      general_strength: ['chest', 'back', 'shoulders', 'quads'],
    };
    const { targetLifts } = p.goalRefinement as { goal: 'get_stronger'; targetLifts: TargetLift[] };
    return [...new Set(targetLifts.flatMap(l => liftMap[l] ?? []))];
  }

  return []; // no priority differentiation for lose_fat / general_fitness
}

function calculateVolumeLandmarks(
  p: OnboardingPayload,
  attrs: InferredAttributes,
  recovery: RecoveryProfile,
): Record<MuscleGroup, VolumeLandmarks> {
  const base = VOLUME_LANDMARKS_BASE[attrs.experienceLevel];
  const prioritySet = new Set(derivePriorityMuscles(p));
  const muscles = Object.keys(base) as MuscleGroup[];

  // Deficit aggression MRV multiplier (fat loss path)
  let deficitMrvMod = 1.0;
  if (attrs.isFatLossPath && p.goalRefinement.goal === 'lose_fat') {
    const mods: Record<DeficitAggression, number> = { aggressive: 0.75, moderate: 0.85, slow: 0.95 };
    deficitMrvMod = mods[(p.goalRefinement as { goal: 'lose_fat'; deficitAggression: DeficitAggression }).deficitAggression];
  }

  return Object.fromEntries(muscles.map(muscle => {
    let { mev, mav, mrv } = base[muscle];

    // Apply combined MRV modifier (recovery × deficit)
    mrv = Math.max(1, Math.round(mrv * recovery.mrvModifier * deficitMrvMod));
    mav = Math.min(mav, mrv);
    mev = Math.min(mev, mav);

    // Returning from break: start below MEV regardless
    const effectiveMev = p.returningFromBreak ? Math.max(1, Math.round(mev * 0.6)) : mev;

    // Starting volume: mid-point between MEV and MAV for priority, MEV for all others
    const startingVolume = prioritySet.has(muscle)
      ? Math.round((effectiveMev + mav) / 2)
      : effectiveMev;

    return [muscle, { mev, mav, mrv, startingVolume }] as [MuscleGroup, VolumeLandmarks];
  })) as Record<MuscleGroup, VolumeLandmarks>;
}

// ─────────────────────────────────────────────────────────────
// SECTION 9: LAYER 5 — INTENSITY PROFILING
// ─────────────────────────────────────────────────────────────

function buildIntensityProfile(p: OnboardingPayload, attrs: InferredAttributes): IntensityProfile {
  const base = { ...INTENSITY_PROFILES_BASE[p.goal] };

  if (
    p.goalRefinement.goal === 'get_stronger' &&
    (p.goalRefinement as { goal: 'get_stronger'; targetLifts: TargetLift[] })
      .targetLifts.includes('general_strength')
  ) {
    base.repRangeMin = 3;   // ← was 1
    base.repRangeMax = 8;   // ← was 6
  }


  // Seed 1RM estimates from working weights (Epley formula, assumes ~5 rep working set)
  let estimated1RM: Partial<Record<TargetLift, number>> | undefined;
  const ww = p.intermediateAdvancedPath?.workingWeights;
  if (ww && Object.keys(ww).length > 0) {
    estimated1RM = {};
    for (const [lift, weight] of Object.entries(ww)) {
      if (weight) {
        // Epley: 1RM ≈ w × (1 + reps / 30), proxy 5 reps at working weight
        estimated1RM[lift as TargetLift] = Math.round(weight * (1 + 5 / 30));
      }
    }
  }

  // Injury guard: cap load zone and maintain safe RIR floor
  if (p.injuries && p.injuries.areas.length > 0) {
    base.loadZoneMax = Math.min(base.loadZoneMax, 80);
    base.rirTarget = Math.max(base.rirTarget, 2); // never grind with injury
  }

  // Returning from break: start conservatively
  if (p.returningFromBreak) {
    base.loadZoneMin = Math.max(50, base.loadZoneMin - 10);
    base.loadZoneMax = Math.min(75, base.loadZoneMax - 10);
    base.rirTarget = Math.max(base.rirTarget, 3);
  }

  return {
    ...base,
    ...(estimated1RM ? { estimated1RM } : {}),
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 10: LAYER 6 — GOAL DECOMPOSITION
// ─────────────────────────────────────────────────────────────

function decomposeGoal(p: OnboardingPayload, attrs: InferredAttributes): GoalDecomposition {
  const { daysPerWeek } = p.schedule;
  const validSplits = SPLIT_OPTIONS[daysPerWeek];

  // ── Split architecture ─────────────────────────────────────
  let splitArchitecture: SplitArchitecture;
  const priorSplit = p.intermediateAdvancedPath?.currentSplit;

  if (
    priorSplit &&
    priorSplit !== 'other' &&
    priorSplit !== 'conjugate' &&
    validSplits.includes(priorSplit as SplitArchitecture)
  ) {
    // Preserve prior split for continuity where compatible
    splitArchitecture = priorSplit as SplitArchitecture;
  } else if (attrs.experienceLevel === 'novice') {
    splitArchitecture = 'full_body'; // higher frequency → faster novice adaptation
  } else if (p.goal === 'get_stronger') {
    splitArchitecture = validSplits.includes('upper_lower') ? 'upper_lower' : validSplits[0];
  } else {
    splitArchitecture = validSplits[validSplits.length - 1]; // most granular available
  }

  // ── Periodization model ────────────────────────────────────
  let periodizationModel: PeriodizationModel;
  if (attrs.experienceLevel === 'novice') {
    periodizationModel = 'linear';
  } else if (attrs.experienceLevel === 'intermediate') {
    periodizationModel = p.goal === 'get_stronger' ? 'block' : 'undulating';
  } else {
    periodizationModel = p.trainingApproach === 'athletic' ? 'conjugate' : 'block';
  }

  // ── Progression scheme ─────────────────────────────────────
  let progressionScheme: ProgressionScheme;
  if (attrs.experienceLevel === 'novice') {
    progressionScheme = 'weekly_linear';
  } else if (attrs.experienceLevel === 'intermediate') {
    progressionScheme = 'double_progression';
  } else {
    progressionScheme = 'wave_loading';
  }

  // ── Mesocycle length ───────────────────────────────────────
  const mesocycleLengthWeeks = attrs.experienceLevel === 'novice' ? 4 : 6;

  // ── Deload frequency ───────────────────────────────────────
  const deloadFrequencyWeeks =
    attrs.experienceLevel === 'novice' ? 8 : // novices rarely need planned deloads
      attrs.experienceLevel === 'intermediate' ? 6 :
        4;   // advanced need more frequent deloads

  // ── Target lifts (get_stronger only) ──────────────────────
  const targetLifts: TargetLift[] = p.goalRefinement.goal === 'get_stronger'
    ? (p.goalRefinement as { goal: 'get_stronger'; targetLifts: TargetLift[] }).targetLifts
    : [];

  return {
    primaryGoal: p.goal,
    splitArchitecture,
    periodizationModel,
    progressionScheme,
    priorityMuscleGroups: derivePriorityMuscles(p),
    targetLifts,
    mesocycleLengthWeeks,
    deloadFrequencyWeeks,
    programStyle: p.trainingApproach,
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 11: CONFIDENCE SCORE
// ─────────────────────────────────────────────────────────────

/**
 * Seeded confidence for the alpha-blend mechanism in the adaptive engine.
 * Starts very low — the system is almost entirely rule-driven at day 1.
 * Grows session by session as the adaptive engine accumulates real signal.
 */
function computeInitialConfidence(p: OnboardingPayload): number {
  let score = 0.05; // base: we have hard constraints but no behavioural data

  // Each additional signal field nudges confidence slightly upward
  if (p.intermediateAdvancedPath?.workingWeights &&
    Object.keys(p.intermediateAdvancedPath.workingWeights).length > 0) score += 0.05; // real 1RM anchors
  if (p.fatLossPath) score += 0.02;
  if (p.beginnerPath) score += 0.01;
  if (p.enrichment?.sleepQuality) score += 0.02;
  if (p.enrichment?.stressLevel) score += 0.02;
  if (p.enrichment?.age) score += 0.01;
  if (p.enrichment?.weight && p.enrichment?.height) score += 0.02;
  if (p.enrichment?.sex) score += 0.01;

  return Math.round(score * 100) / 100;
}

// ─────────────────────────────────────────────────────────────
// SECTION 12: PUBLIC API — MAIN ORCHESTRATOR
// ─────────────────────────────────────────────────────────────

export interface ProfileBuildResult {
  success: boolean;
  profile?: UserProfile;
  errors: string[];
  warnings: string[];
}

/**
 * buildProfile()
 *
 * Runs the full 6-layer pipeline:
 *   L1 Validate → L2 Infer Attributes → L3 Resolve Constraints →
 *   L5b Recovery Profile → L4 Volume Landmarks →
 *   L5 Intensity Profile → L6 Goal Decomposition
 *
 * Returns a fully resolved UserProfile ready for the Workout Generator.
 */
export function buildProfile(payload: OnboardingPayload): ProfileBuildResult {
  // ── L1: Validate ─────────────────────────────────────────
  const validation = validatePayload(payload);
  if (!validation.valid) {
    return { success: false, errors: validation.errors, warnings: validation.warnings };
  }

  // ── L2: Infer attributes ──────────────────────────────────
  const attrs = inferAttributes(payload);

  // ── L3: Resolve constraints ───────────────────────────────
  const constraints = resolveConstraints(payload);

  // ── L5b: Recovery profile (required before volume calc) ───
  const recoveryProfile = buildRecoveryProfile(payload);

  // ── L4: Volume landmarks ──────────────────────────────────
  const volumeLandmarks = calculateVolumeLandmarks(payload, attrs, recoveryProfile);

  // ── L5: Intensity profile ─────────────────────────────────
  const intensityProfile = buildIntensityProfile(payload, attrs);

  // ── L6: Goal decomposition ────────────────────────────────
  const goalDecomposition = decomposeGoal(payload, attrs);

  const profile: UserProfile = {
    experienceLevel: attrs.experienceLevel,
    goal: payload.goal,
    constraints,
    volumeLandmarks,
    intensityProfile,
    goalDecomposition,
    recoveryProfile,
    movementCompetency: attrs.movementCompetency,  // ← add
    tdeeModifier: attrs.tdeeModifier,         // ← add
    ...(attrs.bmi !== undefined ? { bmi: attrs.bmi } : {}), // ← add
    confidenceScore: computeInitialConfidence(payload),
    createdAt: new Date().toISOString(),
    rawPayload: payload,
  };

  // Print the built profile
  console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────────────────');
  console.log('\x1b[32m%s\x1b[0m', '✅ PROFILE BUILT SUCCESSFULLY');
  console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────────────────');
  console.log(JSON.stringify(profile, null, 2));
  console.log('\x1b[36m%s\x1b[0m', '─────────────────────────────────────────────────────────────');

  return {
    success: true,
    profile,
    errors: [],
    warnings: validation.warnings,
  };
}

// ─────────────────────────────────────────────────────────────
// SECTION 13: USAGE EXAMPLES
// ─────────────────────────────────────────────────────────────

/*
// ── Example A: Intermediate hypertrophy, chest/back focus ──

const result = buildProfile({
  goal: 'build_muscle',
  goalRefinement: { goal: 'build_muscle', focusAreas: ['chest', 'back'] },
  equipment: ['full_gym'],
  injuries: { areas: ['lower_back'], severity: 'modify_only' },
  schedule: { daysPerWeek: 4, sessionDurationMinutes: 60 },
  trainingApproach: 'structured',
  trainingHistory: 'consistent',
  returningFromBreak: false,
  intermediateAdvancedPath: {
    currentSplit: 'upper_lower',
    progressStatus: 'progressing',
    workingWeights: { bench_press: 80, deadlift: 120 },
  },
  enrichment: {
    sleepQuality: 'good',
    stressLevel: 'moderate',
    age: 28,
    weight: 80,
    height: 178,
    sex: 'male',
  },
});

// ── Example B: Novice fat loss, home gym ──────────────────

const result2 = buildProfile({
  goal: 'lose_fat',
  goalRefinement: { goal: 'lose_fat', deficitAggression: 'moderate' },
  equipment: ['dumbbells', 'bodyweight'],
  injuries: null,
  schedule: { daysPerWeek: 3, sessionDurationMinutes: 45 },
  trainingApproach: 'structured',
  trainingHistory: 'none',
  returningFromBreak: false,
  beginnerPath: { familiarMovements: ['push', 'pull'] },
  fatLossPath: { activityOutsideGym: 'lightly_active', weightLossHistory: 'slow_steady' },
  enrichment: {
    sleepQuality: 'fair',
    stressLevel: 'high',
    age: 35,
    weight: 90,
    height: 170,
    sex: 'female',
  },
});
*/
