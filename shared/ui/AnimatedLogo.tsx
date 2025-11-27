import { motion } from "framer-motion";
import Image from "next/image";

export default function AnimatedLogo() {
  return (
    <motion.div
      className="flex items-center justify-center h-full bg-white dark:bg-zinc-800 flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 1.5, ease: "easeInOut" },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
    >
      {/* <Image src="/helo-logo.png" alt="Logo" width={250} height={250} /> */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <Image src="/logocs.svg" alt="Logo CS" width={120} height={120} />
        <Image src="/mtp-logo.svg" alt="MTP Logo" width={120} height={120} />
      </div>

      {/* <p className="w-[300px] text-xl font-semibold text-primary dark:text-white -mt-10 text-center">
				Witamy w miejscu, gdzie troska zaczyna się od pierwszego kroku.
			</p> */}
      <span className="text-xl text-center text-primary dark:text-white mt-5">
        powered by HELO<sup>®</sup>
      </span>
    </motion.div>
  );
}
