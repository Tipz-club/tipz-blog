export async function getStaticPaths() {
  const res = await fetch(process.env.WORDPRESS_API_URL + '/posts');
  const posts = await res.json();

  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const res = await fetch(process.env.WORDPRESS_API_URL + `/posts?slug=${params.slug}`);
  const posts = await res.json();
  const post = posts[0];

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
}

export default function PostPage({ post }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      <a href="/">← Back to home</a>
    </main>
  );
}

