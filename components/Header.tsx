export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex justify-center items-center mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-black-300 sm:text-7xl">
        Sense check your inspection using AI
      </div>
      <div className="">
        Upload multiple images from your property inspection and let AI provide
        observations, spot potential problems and give its recommendations.
      </div>
    </div>
  );
}
