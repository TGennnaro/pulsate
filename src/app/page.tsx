import { Button } from '@components/ui/button';
import Link from 'next/link';
import NavHeader from '@components/NavHeader';
import Plans from './plans/Plans';
import Header from '@components/ui/header';
import Features from './Features';
import HeroHeading from '@components/HeroHeading';
import { ArrowRight } from 'lucide-react';
import { Patterns } from '@components/BackgroundPattern';

export default async function Home() {
	return (
		<main className='flex flex-col'>
			<NavHeader>
				<a href='#features'>Features</a>
				<Link href='#pricing'>Pricing</Link>
			</NavHeader>
			<div className='flex flex-col items-center pb-16'>
				<div className='h-[100vh] max-w-screen-md px-8'>
					<div className='absolute absolute-center bg-[radial-gradient(#1d4ed840,_transparent_70%)] h-2/3 aspect-square -z-20' />
					<Patterns.DotGrid className='absolute absolute-center -z-10 h-3/4 aspect-square' />
					<HeroHeading
						title='The solution to organizing medical closets'
						description='Effortlessly organize your medical closet and manage inventory with
						ease using this intuitive solution.'
						className='mt-32'
					>
						<Link href='/app' className='mt-2 w-fit'>
							<Button className='shadow-md'>Get started</Button>
						</Link>
					</HeroHeading>
				</div>
				<Features />
				<div id='pricing' className='flex flex-col items-center px-8 py-16'>
					<HeroHeading
						title='Plans designed for you'
						description="Our plans are tailored to your organization's needs. Spend less on closet organization so you can spend more on saving lives."
						className='mb-20'
					>
						<Link href='/plans'>
							<Button className='shadow-md'>
								View plans
								<ArrowRight className='icon-right' />
							</Button>
						</Link>
					</HeroHeading>
					<Plans />
				</div>
			</div>
		</main>
	);
}
