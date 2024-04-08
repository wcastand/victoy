import {
	useFont,
	listFontFamilies,
	matchFont,
	LinearGradient,
	vec,
	Rect,
	Line2DPathEffect,
	processTransform2d,
	Path2DPathEffect,
	Path1DPathEffect,
	Fill,
	Circle,
	SkPoint,
	Path,
	DashPathEffect,
} from "@shopify/react-native-skia";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartesianChart, Line, Scatter } from "victory-native";

const DATA: { date: string; value: number; inAlert?: number }[] = [
	{ date: "2024-04-05", value: 100 },
	{ date: "2024-04-06", value: 77 },
	{ date: "2024-04-07", value: 80 },
	{ date: "2024-04-08", value: 70 },
	{ date: "2024-04-09", value: 85, inAlert: 1 },
	{ date: "2024-04-10", value: 60 },
];

const fontFamily = "Arial";
const fontStyle = {
	fontFamily,
	fontSize: 12,
	fontStyle: "italic",
	fontWeight: "bold",
};
const font = matchFont(fontStyle as any);

const Limiter = ({ y, chartBounds }) => (
	<Path
		path={`M 0 ${y} L 0 ${y} L ${chartBounds.right} ${y} Z`}
		strokeWidth={1}
		color="gray"
		style="stroke"
	>
		<DashPathEffect intervals={[4, 8]} />
	</Path>
);

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				<CartesianChart
					data={DATA}
					xKey="date"
					yKeys={["value", "inAlert"]}
					domainPadding={{ bottom: 12, left: 12, right: 12, top: 12 }}
					domain={{ y: [60, 100] }}
					axisOptions={{
						font,
						formatXLabel: (x) => x.slice(5),
					}}
				>
					{({ points, chartBounds, yScale }) => (
						<>
							<Line points={points.value} color="blue" curveType="natural" />
							{points.value.map(({ x, y, yValue }, index) => {
								return (
									<Fragment key={`point-${x}-${y}`}>
										<Circle
											cx={x}
											cy={y}
											r={4}
											color={
												yValue > 85 ||
												yValue < 70 ||
												points.inAlert[index].yValue === 1
													? "red"
													: "gray"
											}
										/>
									</Fragment>
								);
							})}
							<Limiter y={yScale(82)} chartBounds={chartBounds} />
							<Limiter y={yScale(65)} chartBounds={chartBounds} />
						</>
					)}
				</CartesianChart>
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 400,
		padding: 25,
		paddingTop: 90,
		backgroundColor: "#fff",
	},
});
