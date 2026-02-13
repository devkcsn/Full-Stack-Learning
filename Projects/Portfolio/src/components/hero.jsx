import 'boxicons/css/boxicons.min.css'
import Spline from '@splinetool/react-spline'

const hero = () => {
  return (
    <main className="relative min-h-[calc(90vh-6rem)] lg:mt-20 px-4">
      {/* Spline Background - only visible on md and below */}
      <div className="md:block lg:hidden absolute inset-0 z-0">
        <Spline 
          className='w-full h-full'
          scene="https://prod.spline.design/wT5mpIJFeH3WxzjA/scene.splinecode" 
        />
      </div>

      {/* Main Content Container */}
      <div className='flex items-center justify-center lg:justify-start gap-8 h-full min-h-[calc(90vh-6rem)]'>
        {/* Text Content */}
        <div className='flex flex-col items-center md:items-center lg:items-start lg:ml-[5%] z-10'>
          {/* Tag box-with gradient border */}
          <div className='relative w-48 h-10 bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full'>
              <div className='absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1'>
                  <i className='bx bxs-zap'></i>INTRODUCING
              </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8">
              EMAIL FOR <br/>
              DEVELOPER
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wider my-8">Developer with a strong hold in building reactive websites using React <br/> and Tailwind CSS.</p>
        </div>

        {/* Spline - Side by side on large screens only */}
        <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-center h-full'>
          <Spline 
            className='w-full h-full max-w-2xl'
            scene="https://prod.spline.design/wT5mpIJFeH3WxzjA/scene.splinecode" 
          />
        </div>
      </div>
    </main>
  )
}

export default hero