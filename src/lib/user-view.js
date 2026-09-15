import Course from "@/models/courseModel";

function assessmentMetadata(assessment) {
  if (!assessment) return null;
  return {
    title: assessment.title,
    durationMinutes: assessment.durationMinutes,
    passingScore: assessment.passingScore,
    questionCount: assessment.questions?.length || 0,
  };
}

export async function getUserView(user) {
  const data = user?.toObject ? user.toObject() : { ...user };
  delete data.password;

  const enrollments = data.enrollments || [];
  const courseIds = enrollments.map((item) => item.courseId).filter(Boolean);
  const courses = await Course.find({ _id: { $in: courseIds } }).lean();
  const courseById = new Map(
    courses.map((course) => [course._id.toString(), course]),
  );

  data.courses = enrollments.flatMap((enrollment) => {
    const course = courseById.get(enrollment.courseId.toString());
    if (!course) return [];

    const completed = new Set((enrollment.completedTopicIds || []).map(String));
    return [
      {
        ...course,
        syllabus: course.syllabus.map((chapter) => ({
          ...chapter,
          topics: chapter.topics.map((topic) => ({
            ...topic,
            topicProgress: completed.has(topic._id.toString()),
          })),
        })),
        progress_status: enrollment.progressPercent || 0,
        assessmentResult: enrollment.assessmentResult,
        finalAssessment: assessmentMetadata(course.finalAssessment),
      },
    ];
  });

  delete data.enrollments;
  const activeDays = [
    ...new Set(
      (data.activityDays || []).map((day) => {
        const date = new Date(day);
        return Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
        );
      }),
    ),
  ].sort((a, b) => b - a);
  let streak = 0;
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  if (activeDays[0] && cursor.getTime() - activeDays[0] <= 86_400_000) {
    let expected = activeDays[0];
    for (const day of activeDays) {
      if (day !== expected) break;
      streak += 1;
      expected -= 86_400_000;
    }
  }
  data.learningStats = {
    streak,
    activeDays: activeDays.length,
    lastActiveAt: data.lastActiveAt || null,
    recentActivity: activeDays.slice(0, 14),
  };
  return data;
}
