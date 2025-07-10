import React from 'react';
import Header from '../../components/Header';

function Featured() {
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

      {/* Content */}
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
            Featured Electric Vehicles
          </h1>
          <p
            style={{
              fontSize: '1.3rem',
              marginBottom: '40px',
              opacity: 0.9,
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Discover our handpicked selection of the most innovative and
            exciting electric vehicles on the market.
          </p>
        </div>
      </section>

      {/* Featured Content */}
      <section
        style={{
          padding: '80px 0px',
          backgroundColor: 'white',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <div style={{ width: '100%', padding: '0 0px' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '60px',
              color: '#1e293b',
            }}
          >
            This Week&#39;s Highlights
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              width: '100%',
              maxWidth: '100%',
              padding: '0 40px',
              boxSizing: 'border-box',
            }}
          >
            {[
              {
                title: 'Tesla Model S Plaid',
                description: 'The fastest production car ever made',
                price: '$135,990',
                image: '🚗',
              },
              {
                title: 'Rivian R1T',
                description: 'Adventure-ready electric pickup truck',
                price: '$73,000',
                image: '🚛',
              },
              {
                title: 'Lucid Air',
                description: 'Luxury meets performance',
                price: '$87,400',
                image: '🏎️',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
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
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                  {item.image}
                </div>
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: '#1e293b',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: '#64748b',
                    marginBottom: '20px',
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#3b82f6',
                  }}
                >
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Featured;
