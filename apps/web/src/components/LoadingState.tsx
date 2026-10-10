import { useElapsedSeconds } from '../hooks/useElapsedSeconds'
import './LoadingState.css'

// Store lookups through SerpAPI usually take 25–35 seconds.
const EXPECTED_SECONDS = 30
const LAST_STEP_MAX_FILL = 0.9

interface LoadingStateProps {
  title: string
  steps: string[]
}

// The API reports no progress, so steps advance on a timer and the last one creeps until data arrives.
export function LoadingState({ title, steps }: LoadingStateProps) {
  const elapsedSeconds = useElapsedSeconds()
  const elapsedSteps = (elapsedSeconds / EXPECTED_SECONDS) * steps.length
  const activeStep = Math.min(steps.length - 1, Math.floor(elapsedSteps))
  const isSlow = elapsedSeconds > EXPECTED_SECONDS * 1.5

  return (
    <div className="loading-state card" role="status">
      <div className="loading-state__header">
        <span className="loading-state__spinner" aria-hidden="true" />
        <div className="loading-state__text">
          <h2 className="text-h4">{title}</h2>
          {/* Keyed so each new step replays the entrance animation. */}
          <p key={activeStep} className="loading-state__step">
            {steps[activeStep]}…
          </p>
        </div>
        <span className="text-caption text-muted loading-state__hint">
          {isSlow ? 'Taking longer than usual' : 'Usually 25–35 seconds'}
        </span>
      </div>

      <div className="loading-state__segments" aria-hidden="true">
        {steps.map((step, index) => (
          <span key={step} className="loading-state__segment">
            <span
              className="loading-state__segment-fill"
              style={{ transform: `scaleX(${stepFill(index, elapsedSteps, steps.length)})` }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

function stepFill(index: number, elapsedSteps: number, stepCount: number): number {
  const stepProgress = elapsedSteps - index
  if (stepProgress <= 0) return 0
  if (index < stepCount - 1) return Math.min(1, stepProgress)
  return LAST_STEP_MAX_FILL * (1 - Math.exp(-stepProgress))
}
