import axios from "axios";

/**
 * Calls the backend to generate a lesson video and image from a topic.
 * @param {string} topic - The lesson topic/title
 * @returns {Promise<{video_url: string, image_url: string}>}
 */
export const generateLesson = async (topic) => {
  const response = await axios.post("http://localhost:5002/generate_lesson", {
    topic
  });

  if (response.data && response.data.video_url) {
    return {
      video_url: response.data.video_url,
      image_url: response.data.image_url
    };
  } else {
    throw new Error("Video generation failed.");
  }
};
