import { useEffect, useState } from 'react';
import { fetchModelMetrics } from '../services/predictApi';

const FALLBACK_METRICS = {
  accuracy: 89.9,
  precision: 88.4,
  recall: 87.8,
  f1_score: 88.1,
  confusion_matrix: [
    [412, 12],
    [24, 385]
  ],
  feature_importance: {
    StudyHours: 0.24,
    Attendance: 0.23,
    Motivation: 0.08,
    AssignmentCompletion: 0.26,
    OnlineCourses: 0.12,
    StressLevel: 0.07
  },
  classes: [0, 1, 2, 3],
  class_metrics: {},
  benchmarks: [
    { name: 'Random Forest', accuracy: 89.9, train_time: '42s', status: 'Current' },
    { name: 'Logistic Regression', accuracy: 82.1, train_time: '8s', status: 'Baseline' },
    { name: 'XGBoost', accuracy: 91.3, train_time: '68s', status: 'Comparable' }
  ]
};

export function useModelMetrics() {
  const [state, setState] = useState({
    metrics: FALLBACK_METRICS,
    loading: true,
    error: ''
  });

  useEffect(() => {
    let active = true;

    fetchModelMetrics()
      .then((metrics) => {
        if (!active) return;
        setState({ metrics, loading: false, error: '' });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          metrics: FALLBACK_METRICS,
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to load model metrics.'
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

