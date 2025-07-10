import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

function About() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          textAlign: 'center',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div style={{ padding: '0 0px', width: '100%' }}>
          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '20px',
            }}
          >
            About MYEVE
          </h1>
        </div>
      </section>

      {/* About Content */}
      <section
        style={{
          padding: '80px 0px',
          backgroundColor: 'white',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '60px',
              alignItems: 'center',
              padding: '0 40px',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '30px',
                  color: '#1e293b',
                }}
              >
                Our Mission
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#64748b',
                  marginBottom: '20px',
                }}
              >
                At EVStore, we believe in the power of electric vehicles to
                transform transportation and protect our planet. Our mission is
                to make electric vehicles accessible to everyone by providing a
                comprehensive platform for discovering, comparing, and
                purchasing the latest electric vehicles.
              </p>
              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#64748b',
                }}
              >
                We partner with leading manufacturers to bring you the most
                innovative and reliable electric vehicles on the market, all
                while providing exceptional customer service and support.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌱</div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: '#1e293b',
                }}
              >
                Sustainability First
              </h3>
              <p
                style={{
                  color: '#64748b',
                  lineHeight: '1.6',
                }}
              >
                Every electric vehicle we offer helps reduce carbon emissions
                and create a cleaner future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        style={{
          padding: '80px 0px',
          backgroundColor: 'white',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div style={{ width: '100%' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '60px',
              color: '#1e293b',
            }}
          >
            Our Team
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              padding: '0 40px',
              boxSizing: 'border-box',
            }}
          >
            {[
              {
                name: 'Hamzah Alhafi',
                role: 'Electrical Engineer',
                bio: 'Bio',
                link: 'https://www.linkedin.com/in/hamzah-alhafi/',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              },
              {
                name: 'Mehrshad Farahbakhsh',
                role: 'Role',
                bio: 'bio',
                link: 'https://github.com/MehrshadFb',
                image: 'https://avatars.githubusercontent.com/u/104742319?v=4',
              },
              {
                name: 'Jason Derulo',
                role: 'Role',
                bio: 'bio',
                link: 'https://www.youtube.com/watch?v=pBI3lc18k8Q',
                image:
                  'https://www.jasonderulo.com/sites/g/files/g2000017781/files/styles/800_800/public/2024-02/JasonDerulo_NuKing.jpg?itok=_50MZVBq',
              },
              {
                name: 'Helena Kamali',
                role: 'Role',
                bio: 'bio',
                link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                image: 'link',
              },
            ].map((member, index) => (
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                key={index}
              >
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative', // Needed for z-index to work
                    zIndex: 1, // Ensures element stays above others
                    willChange: 'transform', // Optimizes animation performance
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow =
                      '0 20px 40px rgba(0,0,0,0.1)';
                    e.currentTarget.style.backgroundColor = '#f8fafc'; // Explicitly set
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '#f8fafc'; // Explicitly set
                  }}
                >
                  <img
                    src={member.image}
                    alt={`${member.name} profile`}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      margin: '0 auto 20px',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1e293b',
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      color: '#3b82f6',
                      fontWeight: '500',
                      marginBottom: '15px',
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      color: '#64748b',
                      lineHeight: '1.6',
                    }}
                  >
                    {member.bio}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
