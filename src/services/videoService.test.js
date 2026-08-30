import {
  CAREER_VIDEO_CATALOG,
  COURSE_TRACKS,
  getCareerVideosByTrack,
  formatWatchTime,
  formatTotalWatchTime,
} from "./videoService";
import { appReducer, defaultState, selectTotalWatchStats } from "../state/store";

describe("Career Restart Video Courses & Track Recommendation Engine", () => {
  test("Catalog contains vetted courses with valid metadata, difficulty, and streaming URLs", () => {
    expect(CAREER_VIDEO_CATALOG.length).toBeGreaterThanOrEqual(8);
    CAREER_VIDEO_CATALOG.forEach((video) => {
      expect(video.id).toBeDefined();
      expect(video.title).toBeDefined();
      expect(video.creator).toBeDefined();
      expect(video.duration).toBeDefined();
      expect(video.views).toBeDefined();
      expect(video.thumbnail).toBeDefined();
      expect(video.category).toBeDefined();
      expect(video.track).toBeDefined();
      expect(video.embedUrl).toContain("https://www.youtube.com/embed/");
      expect(Array.isArray(video.tags)).toBe(true);
    });
  });

  test("Filters UI/UX Design course track correctly", () => {
    const uiuxVideos = getCareerVideosByTrack("uiux", defaultState);
    expect(uiuxVideos.length).toBeGreaterThanOrEqual(2);
    uiuxVideos.forEach((v) => {
      expect(v.track === "uiux" || v.tags.includes("uiux")).toBe(true);
    });
    expect(uiuxVideos[0].title.toLowerCase()).toContain("figma");
  });

  test("Filters Python Programming course track correctly", () => {
    const pythonVideos = getCareerVideosByTrack("python", defaultState);
    expect(pythonVideos.length).toBeGreaterThanOrEqual(2);
    pythonVideos.forEach((v) => {
      expect(v.track === "python" || v.tags.includes("python")).toBe(true);
    });
    expect(pythonVideos[0].title.toLowerCase()).toContain("python");
  });

  test("Filters Java Development course track correctly", () => {
    const javaVideos = getCareerVideosByTrack("java", defaultState);
    expect(javaVideos.length).toBeGreaterThanOrEqual(2);
    javaVideos.forEach((v) => {
      expect(v.track === "java" || v.tags.includes("java")).toBe(true);
    });
    expect(javaVideos[0].title.toLowerCase()).toContain("java");
  });

  test("Filters Self-Financing & Freelance course track correctly", () => {
    const selfFinancingVideos = getCareerVideosByTrack("selffinancing", defaultState);
    expect(selfFinancingVideos.length).toBeGreaterThanOrEqual(2);
    selfFinancingVideos.forEach((v) => {
      expect(v.track === "selffinancing" || v.tags.includes("selffinancing")).toBe(true);
    });
    expect(selfFinancingVideos[0].title.toLowerCase()).toContain("freelance");
  });
});

describe("Watch-Time Formatting & Career Study Session Lifecycle", () => {
  test("Formats watch time properly in MM:SS and human-readable string", () => {
    expect(formatWatchTime(0)).toBe("00:00");
    expect(formatWatchTime(65)).toBe("01:05");
    expect(formatWatchTime(1455)).toBe("24:15");

    expect(formatTotalWatchTime(45)).toBe("45s");
    expect(formatTotalWatchTime(120)).toBe("2 mins");
    expect(formatTotalWatchTime(3660)).toBe("1h 1m");
  });

  test("RECORD_WATCH_SESSION action updates history, total study time, and daily activity", () => {
    const initialWatchTime = defaultState.videoWatchTime || 0;

    const action = {
      type: "RECORD_WATCH_SESSION",
      payload: {
        sessionId: "study-sess-1",
        videoId: "vid-uiux-figma-01",
        videoTitle: "Figma UI/UX Design Masterclass",
        creator: "freeCodeCamp.org",
        category: "UI / UX Design",
        startTime: Date.now() - 600000,
        activeSeconds: 600,
        completed: true,
        status: "completed",
      },
    };

    const nextState = appReducer(defaultState, action);

    // 1. History updated
    expect(nextState.videoWatchHistory.length).toBe(1);
    expect(nextState.videoWatchHistory[0].videoTitle).toBe("Figma UI/UX Design Masterclass");
    expect(nextState.videoWatchHistory[0].activeSeconds).toBe(600);

    // 2. Total time updated
    expect(nextState.videoWatchTime).toBe(initialWatchTime + 600);

    // 3. Daily activity updated
    const activity = nextState.dailyActivity.find((a) => a.type === "video_watch");
    expect(activity).toBeDefined();
    expect(activity.detail).toContain("Figma UI/UX Design Masterclass");

    // 4. Selector stats
    const stats = selectTotalWatchStats(nextState);
    expect(stats.totalSessions).toBe(1);
    expect(stats.totalSeconds).toBe(600);
    expect(stats.totalMinutes).toBe(10);
  });
});
