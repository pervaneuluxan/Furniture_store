import { useState } from 'react';
import { PageIntro } from '../components/layout/Chrome';
import { useGlobalContext } from '../utils/CartContext';
import { useApi, useTitle } from '../utils/hooks';
import { apiErrorMessage, getPage, getPostsByType, sendContactMessage } from '../utils/Models';

const EMPTY = { name: '', email: '', phone: '', message: '' };
const LABELS = { name: 'Name', email: 'Email', phone: 'Phone', message: 'Message' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useGlobalContext();
  const page = useApi(() => getPage('contact'), []);
  const addresses = useApi(() => getPostsByType('address'), []);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [serverError, setServerError] = useState('');
  useTitle('Visit');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
    if (status === 'sent') setStatus('idle');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = {};
    for (const key of Object.keys(EMPTY)) {
      if (!values[key].trim()) found[key] = `Enter your ${LABELS[key].toLowerCase()}.`;
    }
    if (!found.email && !EMAIL_RE.test(values.email.trim())) found.email = 'Enter an email like name@example.com.';
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus('sending');
    setServerError('');
    sendContactMessage(values)
      .then(() => {
        setValues(EMPTY);
        setStatus('sent');
      })
      .catch((error) => {
        setServerError(apiErrorMessage(error));
        setStatus('idle');
      });
  };

  const field = (name, props = {}) => (
    <div className={`field${name === 'message' ? ' span-2' : ''}`}>
      <label htmlFor={`contact-${name}`}>{LABELS[name]}</label>
      {name === 'message' ? (
        <textarea
          id={`contact-${name}`}
          name={name}
          className="input"
          value={values[name]}
          onChange={onChange}
          aria-invalid={errors[name] ? 'true' : undefined}
          aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        />
      ) : (
        <input
          id={`contact-${name}`}
          name={name}
          className="input"
          value={values[name]}
          onChange={onChange}
          aria-invalid={errors[name] ? 'true' : undefined}
          aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
          {...props}
        />
      )}
      {errors[name] && (
        <span id={`contact-${name}-error`} className="field-error">
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <div className="wrap page">
      <PageIntro title={page.data?.title || 'Visit'} lead={page.data?.content} />

      <div className="visit">
        <dl className="visit-details">
          {page.data?.excerpt && (
            <div>
              <dt className="caption">Opening hours</dt>
              <dd>{page.data.excerpt}</dd>
            </div>
          )}
          {(addresses.data?.data ?? []).map((item) => (
            <div key={item.id}>
              <dt className="caption">{item.title}</dt>
              <dd>
                {item.title === 'Email' ? (
                  <a href={`mailto:${item.content}`}>{item.content}</a>
                ) : item.title === 'Phone' ? (
                  <a href={`tel:${item.content.replace(/\s/g, '')}`}>{item.content}</a>
                ) : (
                  item.content
                )}
              </dd>
            </div>
          ))}
        </dl>

        <iframe
          className="visit-map"
          title="Showroom location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.281725670966!2d49.83306591476041!3d40.35827716711747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dffd00e6133%3A0x137483827cf83c8c!2sD%C9%99niz%20Mall!5e0!3m2!1saz!2s!4v1625319029171!5m2!1saz!2s"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <section className="section contact-form">
        <h2 className="heading">Write to us</h2>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            {field('name', { autoComplete: 'name' })}
            {field('email', { type: 'email', autoComplete: 'email' })}
            {field('phone', { type: 'tel', autoComplete: 'tel' })}
            {field('message')}
          </div>
          {serverError && (
            <p className="field-error" role="alert">
              {serverError}
            </p>
          )}
          <div className="form-actions">
            <button type="submit" className="button" disabled={status === 'sending'}>
              {status === 'sending' ? t('sending', 'Sending…') : t('send_message', 'Send message')}
            </button>
            {status === 'sent' && (
              <p className="caption" role="status">
                Message sent. We’ll reply within one business day.
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
