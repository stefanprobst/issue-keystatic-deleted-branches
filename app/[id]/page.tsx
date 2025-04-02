import "@/app/styles.css";

import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

import { reader } from "@/app/reader";

export async function generateStaticParams() {
  const ids = await reader.collections.posts.list();

  return ids.map((id) => {
    return { id };
  });
}

export default async function Post(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const post = await reader.collections.posts.read(id);

  if (!post) return <div>Post not found!</div>;

  const content = await post.content();
  const { default: Content } = await evaluate(content, { ...runtime });

  return (
    <div>
      <h1>{post.title}</h1>
      <Content />
    </div>
  );
}
