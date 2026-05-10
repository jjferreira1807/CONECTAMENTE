"use client";
import { useCallback } from "react";
import type { Section } from "@/content/episodes";
import { AudioPlayer } from "./AudioPlayer";
import { ReflectionInput } from "./ReflectionInput";
import { Checkpoint } from "./Checkpoint";
import { ExerciseThoughtRecord } from "./ExerciseThoughtRecord";
import { ExerciseUrgeSurfing } from "./ExerciseUrgeSurfing";
import { ExerciseScreenAudit } from "./ExerciseScreenAudit";
import { ExerciseValuesLadder } from "./ExerciseValuesLadder";
import { ExerciseSleepHygiene } from "./ExerciseSleepHygiene";
import { ExerciseSocialChallenge } from "./ExerciseSocialChallenge";
import { ExerciseFutureLetter } from "./ExerciseFutureLetter";
import { MeditationGuide } from "./MeditationGuide";
import { MindfulnessTimer } from "./MindfulnessTimer";
import { useProgress } from "@/lib/store";
import { remote } from "@/lib/sync/pushers";

export function SectionRenderer({ section, slug }: { section: Section; slug: string }) {
  const addMinutes = useProgress((s) => s.addMinutes);

  // Stable across renders so AudioPlayer's [onTick] effect doesn't churn.
  const onAudioTick = useCallback(
    (s: number) => {
      addMinutes(slug, s / 60);
      remote.progress({ episodeSlug: slug, minutesEngaged: s / 60 });
      remote.analytics({ kind: "audio_progress", episodeSlug: slug, durationMs: s * 1000 });
    },
    [addMinutes, slug]
  );

  switch (section.kind) {
    case "text":
      return (
        <div>
          {section.title && (
            <h2 className="heading-display text-2xl md:text-3xl">{section.title}</h2>
          )}
          {section.body && (
            <div className="mt-4 prose-soft space-y-4 max-w-2xl">
              {section.body.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          )}
          {section.checkpoint && (
            <div className="mt-6">
              <Checkpoint episodeSlug={slug} sectionId={section.id} label={section.checkpoint} />
            </div>
          )}
        </div>
      );

    case "audio":
      return (
        <AudioPlayer
          src={section.audio?.src}
          title={section.audio?.title ?? "Episódio"}
          subtitle={section.audio?.subtitle}
          onTick={onAudioTick}
        />
      );

    case "reflection":
      return (
        <ReflectionInput
          episodeSlug={slug}
          promptId={section.id}
          prompt={section.prompt ?? ""}
          placeholder={section.promptHint}
        />
      );

    case "timer":
      return (
        <MindfulnessTimer
          defaultSeconds={section.timer?.seconds ?? 180}
          label={section.timer?.label ?? section.title ?? "Respira"}
        />
      );

    case "meditation":
      return <MeditationGuide />;

    case "exercise:thoughtRecord":
      return <ExerciseThoughtRecord episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:urgeSurfing":
      return <ExerciseUrgeSurfing episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:screenAudit":
      return <ExerciseScreenAudit episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:valuesLadder":
      return <ExerciseValuesLadder episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:sleepHygiene":
      return <ExerciseSleepHygiene episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:socialChallenge":
      return <ExerciseSocialChallenge episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
    case "exercise:futureLetter":
      return <ExerciseFutureLetter episodeSlug={slug} exerciseId={section.exerciseId ?? section.id} />;
  }
}
