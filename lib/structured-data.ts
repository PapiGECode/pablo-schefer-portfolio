import type { BlogPost } from './blog-data'

export function generateBlogPostStructuredData(post: BlogPost, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${url}/og-images/${post.slug}.png`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: 'https://github.com/PapiGECode',
    },
    publisher: {
      '@type': 'Person',
      name: 'Pablo Schefer Orduña',
      url: 'https://pabloschefer.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    timeRequired: post.readTime,
  }
}

export function generateWebsiteStructuredData(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PapiGECode',
    description: "El laboratorio digital de Pablo Schefer Orduña: comunidades, moderación, vibecoding y proyectos digitales.",
    url: url,
    author: {
      '@type': 'Person',
      name: 'Pablo Schefer Orduña',
      url: 'https://github.com/PapiGECode',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pablo Schefer Orduña',
    url: 'https://pabloschefer.vercel.app',
    image: 'https://pabloschefer.vercel.app/pablo-avatar.gif',
    sameAs: [
      'https://github.com/PapiGECode',
      'https://x.com/PapiGEGamer',
      'https://www.instagram.com/papigegamer/',
    ],
    jobTitle: 'Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'PapiGECode',
    },
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
