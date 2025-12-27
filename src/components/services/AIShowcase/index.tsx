'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './AIShowcase.module.css';

const AI_STAGES = [
  {
    id: 'discover',
    number: '01',
    title: 'Discover & Analyze',
    description: 'We assess your data landscape, identify AI opportunities, and define success metrics aligned with business outcomes.',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    accent: 'var(--accent-1)',
  },
  {
    id: 'design',
    number: '02',
    title: 'Design & Architect',
    description: 'Our team designs the AI solution architecture, selecting optimal models and integration patterns for your stack.',
    icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
    accent: 'var(--accent-2)',
  },
  {
    id: 'develop',
    number: '03',
    title: 'Develop & Train',
    description: 'We build custom models, fine-tune LLMs, implement RAG pipelines, and develop intelligent agents tailored to your needs.',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    accent: 'var(--accent-3)',
  },
  {
    id: 'integrate',
    number: '04',
    title: 'Integrate & Deploy',
    description: 'Seamless integration into your existing systems with production-grade deployment, testing, and performance optimization.',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    accent: 'var(--accent-6)',
  },
  {
    id: 'optimize',
    number: '05',
    title: 'Monitor & Evolve',
    description: 'Continuous monitoring, model refinement, and iterative improvements ensure your AI systems grow smarter over time.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    accent: 'var(--accent-5)',
  },
] as const;

export function AIShowcase(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [visibleStages, setVisibleStages] = useState<Set<string>>(new Set());
  const [highestVisibleIndex, setHighestVisibleIndex] = useState(-1);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [maxRevealedIndex, setMaxRevealedIndex] = useState(-1);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header visibility - one time trigger
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          headerObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    headerObserver.observe(section);

    // Stage visibility - tracks enter AND exit for progress bar
    const stageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stageId = entry.target.getAttribute('data-stage');
          const stageIndex = parseInt(entry.target.getAttribute('data-index') || '-1', 10);

          if (stageId) {
            if (entry.isIntersecting) {
              // Stage entered viewport
              setVisibleStages((prev) => new Set([...prev, stageId]));

              // Update highest visible index for progress bar
              setHighestVisibleIndex((prev) => Math.max(prev, stageIndex));

              // Track max revealed for keeping stages visible
              setMaxRevealedIndex((prev) => Math.max(prev, stageIndex));
            } else {
              // Stage exited viewport - update highest visible
              // Find the new highest visible stage
              const currentVisible = stageRefs.current
                .map((ref, idx) => ({ ref, idx }))
                .filter(({ ref }) => {
                  if (!ref) return false;
                  const rect = ref.getBoundingClientRect();
                  const viewportHeight = window.innerHeight;
                  return rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4;
                })
                .map(({ idx }) => idx);

              const newHighest = currentVisible.length > 0 ? Math.max(...currentVisible) : -1;
              setHighestVisibleIndex(newHighest);
            }
          }
        });
      },
      { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' }
    );

    stageRefs.current.forEach((ref) => {
      if (ref) stageObserver.observe(ref);
    });

    return () => {
      headerObserver.disconnect();
      stageObserver.disconnect();
    };
  }, []);

  // Calculate progress based on highest visible index
  const progressPercent = highestVisibleIndex >= 0
    ? ((highestVisibleIndex + 1) / AI_STAGES.length) * 100
    : 0;

  // A stage is shown if it's been revealed at any point
  const isStageRevealed = useCallback((index: number) => {
    return index <= maxRevealedIndex || visibleStages.has(AI_STAGES[index].id);
  }, [maxRevealedIndex, visibleStages]);

  return (
    <section ref={sectionRef} className={styles.section} id="ai-showcase">
      <div className={styles.inner}>
        {/* Header */}
        <div className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <span className={styles.kicker}>End-to-End AI Integration</span>
          <h2 className={styles.title}>
            From Concept to{' '}
            <span className={styles.gradient}>Intelligent Systems</span>
          </h2>
          <p className={styles.subtitle}>
            Building AI-powered solutions requires more than just models. Our comprehensive
            approach ensures every component works together seamlessly.
          </p>
        </div>

        {/* Timeline */}
        <div className={styles.timeline} ref={timelineRef}>
          {/* Connecting line */}
          <div className={styles.timelineLine}>
            <div
              className={styles.timelineProgress}
              style={{ height: `${progressPercent}%` }}
            />
          </div>

          {/* Stages */}
          {AI_STAGES.map((stage, index) => (
            <div
              key={stage.id}
              ref={(el) => {
                stageRefs.current[index] = el;
              }}
              data-stage={stage.id}
              data-index={index}
              className={`${styles.stage} ${isStageRevealed(index) ? styles.visible : ''} ${
                index % 2 === 1 ? styles.right : ''
              }`}
              style={{ '--stage-accent': stage.accent } as React.CSSProperties}
            >
              {/* Node */}
              <div className={styles.node}>
                <div className={`${styles.nodeInner} ${index <= highestVisibleIndex ? styles.active : ''}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.nodeIcon}
                  >
                    <path d={stage.icon} />
                  </svg>
                </div>
                <span className={styles.nodeNumber}>{stage.number}</span>
              </div>

              {/* Content */}
              <div className={styles.stageContent}>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDescription}>{stage.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className={`${styles.highlight} ${highestVisibleIndex === AI_STAGES.length - 1 ? styles.visible : ''}`}>
          <div className={styles.highlightIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className={styles.highlightText}>
            The result: AI solutions that are not just technically sound, but aligned with
            your business goals and ready for production.
          </p>
        </div>
      </div>
    </section>
  );
}
