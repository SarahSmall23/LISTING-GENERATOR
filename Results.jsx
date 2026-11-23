import CopyButton from "./CopyButton.jsx";

function Block({ title, text }) {
  return (
    <section className="block">
      <header>
        <h3>{title}</h3>
        <CopyButton text={text} />
      </header>
      <p>{text}</p>
    </section>
  );
}

export default function Results({ result, loading, error }) {
  if (loading) {
    return (
      <div className="panel results" aria-live="polite">
        <div className="skeleton" />
        <div className="skeleton short" />
        <div className="skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel results" role="alert">
        <div className="error">
          <strong>We couldn't generate your listing.</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="panel results empty">
        <h2>Your listing will appear here</h2>
        <p>Fill in the product details and choose Generate listing. You'll get a description, caption, hashtags and SEO title, each ready to copy.</p>
      </div>
    );
  }

  const hashtags = result.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ");
  const all = [
    result.seoTitle,
    result.description,
    result.caption,
    hashtags,
  ].join("\n\n");

  return (
    <div className="panel results" aria-live="polite">
      <div className="results-head">
        <h2>Your listing</h2>
        <CopyButton text={all} label="Copy everything" />
      </div>
      <Block title="SEO title" text={result.seoTitle} />
      <Block title="Description" text={result.description} />
      <Block title="Caption" text={result.caption} />
      <section className="block">
        <header>
          <h3>Hashtags</h3>
          <CopyButton text={hashtags} />
        </header>
        <div className="tags">
          {result.hashtags.map((h) => (
            <span key={h} className="tag">#{h.replace(/^#/, "")}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
