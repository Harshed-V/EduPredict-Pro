async function apiRequest(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { detail: await response.text() };

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export function predictStudentPerformance(payload) {
  return apiRequest('/api/predict', {
    method: 'POST',
    body: JSON.stringify({
      StudyHours: payload.studyHours,
      Attendance: payload.attendance,
      Motivation: payload.motivation,
      AssignmentCompletion: payload.assignment,
      OnlineCourses: payload.courses,
      StressLevel: payload.stress
    })
  });
}

export function fetchModelMetrics() {
  return apiRequest('/api/metrics', {
    method: 'GET'
  });
}

export function checkBackendHealth() {
  return apiRequest('/api/health', {
    method: 'GET'
  });
}

export function askFaq(question, features = {}) {
  return apiRequest('/api/faq', {
    method: 'POST',
    body: JSON.stringify({
      question,
      studyHours: features.studyHours,
      attendance: features.attendance,
      motivation: features.motivation,
      assignment: features.assignment,
      courses: features.courses,
      stress: features.stress
    })
  });
}
