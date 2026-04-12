import { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { useLocation } from 'wouter';

export default function BecomeWorker() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', service: '', hourlyRate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/worker/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          skills: [formData.service],
          phone: formData.phone,
          location: formData.city,
          hourlyRate: Number(formData.hourlyRate) || 0,
        })
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-3">Welcome to Aetherix!</h1>
          <p className="text-gray-400 mb-8">Your application has been submitted successfully.</p>
          <button onClick={() => setLocation('/')} className="px-8 py-3 rounded-xl bg-white hover:bg-white/80 text-black font-bold transition-all">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e7e5e4] font-sans flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold tracking-tighter">Aetherix</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#252626] flex items-center justify-center border border-[#484848]/30">
            <Users className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-xl z-10">
          {/* Title */}
          <div className="mb-10 text-center md:text-left">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/60 mb-3 block">Aetherix Network</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 leading-tight">
              Start your journey <br/><span className="text-gray-500">as a Partner.</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto md:mx-0">
              Join a community of elite service providers. Set your own rates and manage your growth with intelligence.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#252626]/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-[#484848]/15">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                <input
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-[#484848] rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all placeholder:text-gray-700"
                  placeholder="Enter your full name" type="text" required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                  <input
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black border border-[#484848] rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all placeholder:text-gray-700"
                    placeholder="+91 XXXX XXXX" type="tel" required
                  />
                </div>
                {/* City */}
                <div className="space-y-2">
                  <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 ml-1">City</label>
                  <input
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-black border border-[#484848] rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all placeholder:text-gray-700"
                    placeholder="e.g. Mumbai" type="text" required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 ml-1">Service Type</label>
                <select
                  value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-black border border-[#484848] rounded-xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option disabled value="">Select your expertise</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="driver">Private Driver</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="technician">IT Technician</option>
                  <option value="other">Other Professional Service</option>
                </select>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500 ml-1">Base Hourly Rate</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input
                    value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                    className="w-full bg-black border border-[#484848] rounded-xl py-4 pl-10 pr-16 text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all placeholder:text-gray-700"
                    placeholder="0" type="number" required
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[0.6875rem] font-bold text-gray-500">INR / HR</span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit" disabled={submitting}
                  className="w-full py-5 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-sm tracking-widest uppercase active:scale-95 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <p className="text-center text-[0.6875rem] text-gray-600 mt-6 uppercase tracking-wider">
                  By clicking submit, you agree to Aetherix Partner Terms.
                </p>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#131313] p-6 rounded-2xl border border-[#484848]/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xl">🛡️</div>
              <div>
                <h4 className="font-bold text-sm mb-1">Global Verification</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Identity checks and professional certifications processed in 24h.</p>
              </div>
            </div>
            <div className="bg-[#131313] p-6 rounded-2xl border border-[#484848]/15 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xl">💰</div>
              <div>
                <h4 className="font-bold text-sm mb-1">Instant Payouts</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Withdraw your earnings directly to your preferred wallet daily.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
