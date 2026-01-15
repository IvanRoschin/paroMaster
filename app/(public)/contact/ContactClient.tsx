'use client';

import { FaCalendarAlt } from 'react-icons/fa';

import { addNewLeadAction } from '@/actions/leads';
import { Breadcrumbs, LeadForm } from '@/components';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
};

const center = {
  lat: 50.52175, // Ірпінь
  lng: 30.25055,
};

export default function ContactClient() {
  return (
    <div className="max-w-6xl mx-auto py-3 container">
      <Breadcrumbs />

      <h2 className="subtitle mb-4 text-center">Контакти</h2>

      {/* === Локація на карті === */}
      <section className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col items-center">
          <h3 className="subtitle mb-4">Ми на Google карті</h3>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2538.995882792906!2d30.25055!3d50.52175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce7b847cf3ab%3A0x8d5d7414d94a0f0b!2sIrpin!5e0!3m2!1suk!2sua!4v1730916000000!5m2!1suk!2sua"
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: '10px' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </section>
      {/* <section className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col items-center">
          <div className="flex flex-row justify-center items-baseline">
            <FaMapMarkerAlt className="inline-block mr-1 subtitle" />
            <Logo />
          </div>
          <h3 className="subtitle mb-4 flex justify-center items-center">
            на Google карті
          </h3>
        </div>

        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </section> */}

      {/* === Графік роботи + форма === */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <section className="mb-8 border-b lg:border-b-0 border-gray-200 pb-6 lg:pb-0 flex-1">
          <h3 className="subtitle mb-4 flex justify-center items-center">
            <FaCalendarAlt className="inline-block mr-2" /> Режим роботи
          </h3>
          <div className="text-lg text-gray-700 space-y-2 text-center lg:text-left">
            <p>
              <strong>Понеділок — Пʼятниця:</strong> 9:00 – 18:00
            </p>
            <p>
              <strong>Субота:</strong> 10:00 – 16:00
            </p>
            <p>
              <strong>Неділя:</strong> Вихідний
            </p>
          </div>
        </section>
        <section className="flex-1">
          <LeadForm
            action={addNewLeadAction}
            title="Замовити зворотній дзвінок"
            subtitle
          />
        </section>
      </div>
    </div>
  );
}
