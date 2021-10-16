import React, { useState, useEffect } from "react";
import { AppendScript, AppendStyle } from "../../utils/Append";
import { getPostsByType } from "../../utils/Models";
import PageTop1 from "../template/PageTop1";
import Tabs from "../template/Tabs";

export default function About() {
  const [posts, setPosts] = useState([]);
  const [member, setMember] = useState([]);

  useEffect(() => {
    AppendStyle("about");
    AppendScript("about");

    getPostsByType(23).then((res) => {
      let res_data = res.data;
      const posts = [];

      for (let index in res_data.data) {
        let row = res_data.data[index];

        posts.push({
          title: row.title,
          featured: row.featured,
          content: row.content,
          prof: row.metas.profession,
        });
      }
      setPosts(posts);
    });
    getPostsByType(24).then((res) => {
      let res_data = res.data;
      const members = [];

      for (let index in res_data.data) {
        let row = res_data.data[index];

        members.push({
          title: row.title,
          featured: row.featured,
          excerpt: row.excerpt,
          icon1: row.metas.icon_class,
          icon2: row.metas.icon_class2,
          icon3: row.metas.icon_class3,
          prof: row.metas.profession,
        });
      }
      setMember(members);
    });
  }, []);

  return (
    <>
      <PageTop1 id="4" />

      <section className="dispatch full_width">
        <div className="center">
          <div className="dispatch_in full_width flex">
            <div className="dispatch_in_left">
              <img src="assets/images/about_dispatch_img.jpg" alt="" />
            </div>

            <div className="dispatch_in_right">
              <div className="tabs flex flex_wrap">
                <Tabs />
                <span className="flex align_center">
                  <a href="#" className="learn_more">
                    Learn more
                  </a>
                  <i className="mkd-icon-linear-icon lnr lnr-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="testimonials_section full_width">
        <div className="center">
          <div className="testimonials_section_in flex direction_column justify_center align_center">
            <h3>WHAT THEY’RE SAYING</h3>
            <div className="slider full_width single-item">
              {posts &&
                posts.map((item, key) => {
                  return (
                    <div className="item flex direction_column justify_center align_center ">
                      <p>
                        Vestibulum ultricies aliquam convallis. Maecenas
                        uttellus mi. Proin tincidunt, lectus. Lorem ipsum dolor
                        sit amet, consectetur elit. In ut ullamcorper leo, eget
                        euismod orci. Cum sociis pena tibus et magnis dis
                        parturient montes, nascetur ipsum dolor sit amet.
                      </p>
                      <img src={item.featured} alt={item.title} />
                      <h5>{item.title}</h5>
                      <h6>{item.prof}</h6>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      <section className="our_team full_width">
        <div className="center">
          <div className="our_team_in full_width">
            <h2>Our Team</h2>
            <ul className="team_list flex flex_wrap full_width">
              {member &&
                member.map((item, key) => {
                  return (
                    <li>
                      <a href="#">
                        <img src={item.featured} alt={item.title} />
                      </a>
                      <h4>
                        <a href="#">{item.title}</a>
                      </h4>
                      <h6>{item.prof}</h6>
                      <p>{item.excerpt}</p>
                      <ul className="social_links flex justify_center">
                        <li>
                          <a href="#">
                            <i className={item.icon1}></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className={item.icon2}></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className={item.icon3}></i>
                          </a>
                        </li>
                      </ul>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
