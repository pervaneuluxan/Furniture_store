import React, { useEffect, useState } from "react";
import { getPostsByType } from "../../utils/Models";

const Tabs = () => {
  const [loading, setLoading] = useState(true);
  const [tabsInfo, setTabsInfo] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    getPostsByType(15).then((res) => {
      let res_data = res.data;
      console.log("res_data", res_data);

      const tabs = [];

      for (let index in res_data.data) {
        let row = res_data.data[index];

        tabs.push({
          title: row.title,
          excerpt: row.excerpt,
        });
      }
      setTabsInfo(tabs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  const { title, excerpt } = tabsInfo[value];
  return (
    <div className="tabs flex flex_wrap">
      <>
        {tabsInfo.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => setValue(index)}
              className={`tab_lable ${index === value && "active_lable"}`}
            >
              {item.title}
            </button>
          );
        })}
        <div className="tab">
          <p>{excerpt}</p>
        </div>
      </>
    </div>
  );
};

export default Tabs;
