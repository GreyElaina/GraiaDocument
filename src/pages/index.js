import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>框架式开发</>,
    //imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Graia Framework 在 Graia Project 中作为基础设施的一部分,
        借鉴了多种机器人开发框架的设计, 并创造出了多种独有设计,
        从而使开发者能更好的表现逻辑思维.
      </>
    ),
  },
  {
    title: <>简洁而强大</>,
    description: (
      <>
        在思考 "该怎么样能将机器人应用作为一个大型项目开发" 的问题上,
        我们给出了 "渐进式框架" 的答案. 我们正努力使入门开发尽可能简单的同时,
        让高阶开发也能创造出更多的可能性.
      </>
    )
  },
  {
    title: <>富有表现性</>,
    description: (
      <>
        通过使用 <code>Dispatcher</code>, <code>Decorator</code>, <code>Interrupt</code> 等特性,
        你可以以更简洁的代码实现更为复杂的逻辑, 做出更有趣的东西.
      </>
    )
  }
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Graia Framework Document">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/intro')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
