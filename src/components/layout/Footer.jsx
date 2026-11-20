import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getMenu, getPage, getPostsByType } from '../../utils/Models';

const fixLink = (link) => (link === '/galery' ? '/gallery' : link || '/');

export default function Footer() {
  const [columns, setColumns] = useState([]);
  const [hours, setHours] = useState('');
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    getMenu('footer').then((res) => setColumns(res.data)).catch(() => {});
    getPage('contact').then((res) => setHours(res.data.excerpt)).catch(() => {});
    getPostsByType('address').then((res) => setAddresses(res.data.data)).catch(() => {});
  }, []);

  const street = addresses.find((a) => a.title === 'Address');
  const others = addresses.filter((a) => a !== street);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-visit">
            <p>{street ? street.content : 'Depot showroom'}</p>
            {hours && <p>{hours}</p>}
            {others.map((item) => (
              <p key={item.id}>{item.content}</p>
            ))}
          </div>
          {columns.map((column) => (
            <div key={column.id} className="footer-col">
              <h2>{column.title}</h2>
              <ul>
                {column.subs.map((sub) => (
                  <li key={sub.id}>
                    <Link to={fixLink(sub.link)}>{sub.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Depot</p>
          <p>
            <a href="https://instagram.com" rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
