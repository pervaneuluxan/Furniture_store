import { PageIntro } from '../components/layout/Chrome';
import { useApi, useTitle } from '../utils/hooks';
import { getPage, getPostsByType } from '../utils/Models';

export default function About() {
  const page = useApi(() => getPage('about'), []);
  const story = useApi(() => getPostsByType('about-tab'), []);
  const team = useApi(() => getPostsByType('team-member'), []);
  const quotes = useApi(() => getPostsByType('testimonial'), []);
  useTitle('About');

  return (
    <div className="wrap page">
      <PageIntro title={page.data?.title || 'About'} lead={page.data?.content} />

      <section className="about-story">
        {page.data?.featured && (
          <img src={page.data.featured} alt="" className="about-image" width="1000" height="1500" />
        )}
        <div className="about-points">
          {(story.data?.data ?? []).map((item) => (
            <div key={item.id}>
              <h2 className="heading">{item.title}</h2>
              <p className="caption">{item.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      {(team.data?.data ?? []).length > 0 && (
        <section className="section">
          <h2 className="heading section-head">The people in the showroom</h2>
          <ul className="team">
            {team.data.data.map((person) => (
              <li key={person.id}>
                <img src={person.featured} alt="" loading="lazy" width="800" height="697" />
                <h3 className="piece-title">{person.title}</h3>
                <p className="caption">{person.metas.profession}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(quotes.data?.data ?? []).length > 0 && (
        <section className="section">
          <h2 className="heading section-head">What visitors say</h2>
          <div className="quotes">
            {quotes.data.data.map((q) => (
              <figure key={q.id}>
                <blockquote>
                  <p>{q.content}</p>
                </blockquote>
                <figcaption className="caption">
                  {q.title}, {q.metas.profession}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
