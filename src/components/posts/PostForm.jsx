/** @jsx createVNode */
import { createVNode } from "../../lib";

export const PostForm = () => {
  return (
    <div class="mb-4 bg-white rounded-lg shadow p-4">
      <form id="post-form" data-submit="post-submit">
        <textarea
          id="post-content"
          placeholder="무슨 생각을 하고 계신가요?"
          class="w-full p-2 border rounded"
        ></textarea>
        <button
          id="post-submit"
          type="submit"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          게시
        </button>
      </form>
    </div>
  );
};