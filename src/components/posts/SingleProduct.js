import React, { useState, useEffect, useContext } from "react";
import { useGlobalContext } from "../../utils/CartContext";
import { AppendStyle } from "../../utils/Append";
import {
  getPostBySlug,
  getCategories,
  getPostsByType,
  getPostById,
} from "../../utils/Models";
import ProductItemBox from "../template/ProductItemBox";

export default function SingleProduct(props) {
  const {addBasket,addWishlist}=useGlobalContext();
  const [post, setPost] = useState("");
  const [postMetas, setPostMetas] = useState("");
  const [postGallery, setPostGallery] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [hasDiscount, setHasDiscount] = useState(null);
  const [pageTop, setPageTop] = useState("");

  const item_link = props.match.params.item_link;
  console.log(item_link);

  const {translate} = useGlobalContext();

  const [addBasketCount, setAddBasketCount] = useState(1);

  useEffect(() => {
    AppendStyle("singleProduct");

    getPostBySlug(item_link).then((res) => {
      let data = res.data;

      let discount = data.metas.discount,
        price = data.metas.price,
        discount_start_date = new Date(data.metas.discount_start_date),
        discount_end_date = new Date(data.metas.discount_end_date),
        now_date = new Date(),
        calc_discount = (price * (100 - discount)) / 100;

      setHasDiscount(
        discount_start_date <= now_date && discount_end_date >= now_date
          ? true
          : false
      );
      setDiscountPrice(calc_discount);

      setPost(data);
      setPostMetas(data.metas);

      const images = [];

      for (let key in data.metas.images) {
        let row = data.metas.images[key];

        images.push(row);
      }
      setPostGallery(images);
    });

    getPostsByType(10, 4, 1, "p.view DESC").then((res) => {
      let res_data = res.data;

      const posts = [];

      for (let index in res_data.data) {
        let row = res_data.data[index];

        if (row.slug === item_link) {
          continue;
        }

        let discount = row.metas.discount,
          price = row.metas.price,
          discount_start_date = new Date(row.metas.discount_start_date),
          discount_end_date = new Date(row.metas.discount_end_date),
          now_date = new Date(),
          calc_discount = (price * (100 - discount)) / 100;

        let has_discount =
          discount_start_date <= now_date && discount_end_date >= now_date
            ? true
            : false;

        posts.push({
          title: row.title,
          featured: row.featured,
          excerpt: row.excerpt,
          metas: row.metas,
          link: row.slug,
          date: row.date,
          has_discount: has_discount,
          price: price,
          discount_price: calc_discount,
        });
      }
      setRelatedProducts(posts);
    });

    getPostById(10).then((res) => {
      let data = res.data;

      setPageTop(data);
    });
  },[]);

  return (
    <>
      <section className="single_product_banner full_width">
        <div className="center">
          <div className="single_product_banner_in full_width">
            <ul className="banner_list">
              <li>
                <a href="index.html">{translate.home_title}</a>
              </li>
              <li>
                <span>/</span>
              </li>
              <li>
                <a href="shop.html">{pageTop.title}</a>
              </li>
              <li>
                <span>/</span>
              </li>
              <li className="product_title">
                <span>{post.title}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="product full_width">
        <div className="center">
          <div className="product_in full_width">
            <div className="product_top full_width flex">
              <div className="product_gallery">
                <ul className="product_gallery_list">
                  {postGallery &&
                    postGallery.map((item, key) => {
                      return (
                        <li>
                          <img src={item} alt={post.title} />
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="product_content full_width">
                <ul className="product_content_list flex direction_column">
                  <li>
                    <h3>{post.title}</h3>
                  </li>
                  <li>
                    <p className="product_price">
                      {hasDiscount ? (
                        <>
                          <span className="product_price">
                            <del>${postMetas.price}</del>
                          </span>
                          <span className="product_price">
                            ${discountPrice}
                          </span>
                        </>
                      ) : (
                        <span className="product_price">
                          ${postMetas.price}
                        </span>
                      )}
                    </p>
                  </li>
                  <li>
                    <span className="rating_icon">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="far fa-star"></i>
                      <i className="far fa-star"></i>
                    </span>
                    <span className="customer_review">(1 customer review)</span>
                  </li>
                  <li>
                    <p className="product_text">{post.excerpt}</p>
                  </li>
                  <li>
                    <form>
                      <ul className="add_cart_form_list flex">
                        {postMetas.stock > 3 ? (
                          <>
                            <li className="quantity_buttons flex">
                              <span className="quantity_label">Quantity</span>

                              <input
                                type="number"
                                defaultValue={addBasketCount}
                                min="1"
                                onChange={(e) => {
                                  setAddBasketCount(e.target.value);
                                }}
                                max={postMetas.stock}
                                className="qty_input"
                              />
                            </li>
                            <li>
                              <button
                                type="button"
                                className="add_cart_btn"
                                onClick={addBasket.bind(
                                  this,
                                  post.id,
                                  addBasketCount
                                )}
                              >
                                Add to Cart
                              </button>
                            </li>
                          </>
                        ) : (
                          <p>Sold out</p>
                        )}
                      </ul>
                    </form>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="add_wishlist_btn"
                      onClick={addWishlist.bind(this, post.id)}
                    >
                      <i className="far fa-heart"></i>
                      <span>Add to wishlist</span>
                    </button>
                  </li>
                  <li className="product_meta flex direction_column">
                    <span>SKU:059</span>
                    <span>
                      Category: <a href="#">Concept</a>
                    </span>
                    <span>
                      Tags:<a href="#">Boxes,</a>
                      <a href="#">Wood</a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product_bottom full_width">
        <div className="center">
          <div className="product_bottom_in full_width">
            <div className="tabs full_width flex flex_wrap">
              <input type="radio" id="description_tab" name="myTabs" checked />
              <label for="description_tab" className="tabs_title desc_tab">
                Description
              </label>
              <div className="tab full_width">
                <h2>Description</h2>
                <p className="tab_content">{post.content}</p>
              </div>
              <input
                type="radio"
                id="additional_information_tab"
                name="myTabs"
              />
              <label
                for="additional_information_tab"
                className="tabs_title add_tab"
              >
                Additional information
              </label>
              <div className="tab full_width">
                <h2>Additional information</h2>
                <table>
                  <tr>
                    <th>Weight</th>
                    <td>{postMetas.weight} kq</td>
                  </tr>
                  <tr>
                    <th>Dimensions</th>
                    <td>10 × 10 × 15 cm</td>
                  </tr>
                  <tr>
                    <th>Color</th>
                    <td>Grey</td>
                  </tr>
                  <tr>
                    <th>Material</th>
                    <td>Chrome</td>
                  </tr>
                </table>
              </div>
              <input type="radio" id="reviews_tab" name="myTabs" />
              <label for="reviews_tab" className="tabs_title review_tab">
                Reviews <span>(1)</span>
              </label>
              <div className="tab full_width">
                <h2>
                  1 review for
                  <span>Gray Chair</span>
                </h2>
                <div className="comment_text full_width flex">
                  <img src="assets/images/product_comment1.png" alt="" />
                  <ul className="flex direction_column">
                    <li>
                      <span className="rating_icon">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                        <i className="far fa-star"></i>
                      </span>
                    </li>
                    <li>
                      <strong>Olivia Schmidt </strong>
                      <span className="date">-</span>
                      <span className="date">08.02.2020.</span>
                    </li>
                    <li>
                      <p>Super!</p>
                    </li>
                  </ul>
                </div>
                <div className="add_review full_width">
                  <h3>Add a review </h3>
                  <p>
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <form className="full_width">
                    <ul className="comment_form_list full_width flex direction_column">
                      <li>
                        <label for="comment">Your review *</label>
                        <textarea
                          id="commnet"
                          cols="45"
                          rows="8"
                          className="textarea"
                          required
                        ></textarea>
                      </li>
                      <li>
                        <label for="name">Name *</label>
                        <input
                          type="text"
                          id="name"
                          className="comment_input"
                          required
                        />
                      </li>
                      <li>
                        <label for="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          className="comment_input"
                          required
                        />
                      </li>
                      <li>
                        <input
                          type="checkbox"
                          id="check_input"
                          className="check_input"
                          required
                        />
                        <label for="check_input" className="check_lable">
                          Save my name, email, and website in this browser for
                          the next time I comment.
                        </label>
                      </li>
                      <li>
                        <button type="submit" className="comment_btn">
                          Submit
                        </button>
                      </li>
                    </ul>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="related_products full_width">
        <div className="center">
          <div className="related_products_in full_width">
            <h2>Related Products</h2>
            <ul className="product_list">
              {relatedProducts.map((item, key) => {
                return <li><ProductItemBox key={key} item={item} /></li>;
              })}
            </ul>
            <div></div>
          </div>
        </div>
      </section>
    </>
  );
}
