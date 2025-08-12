import React from "react";
import type { Moment } from "moment";
import { Timekeep } from "@/timekeep/schema";
import { getTotalDuration } from "@/timekeep";
import { TimekeepSettings } from "@/settings";
import { Page, View, Text, Document, StyleSheet } from "@react-pdf/renderer";
import {
	formatPdfDate,
	formatDurationLong,
	formatDurationShort,
} from "@/utils";

import TimesheetPdfTable from "./TimesheetPdfTable";
import TimesheetPdfDetailField from "./TimesheetPdfDetailField";

type Props = {
	title: string;
	data: Timekeep;
	currentTime: Moment;
	footnote: string;
	settings: TimekeepSettings;
};

const styles = StyleSheet.create({
	// Styles for a page
	page: {
		fontFamily: "Roboto",
		padding: 15,
	},

	// Heading with the page title and timesheet title
	heading: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},

	// User specified title and "Timesheet"
	title: {
		fontFamily: "Roboto",
		fontWeight: 700,
		fontSize: 12,
		marginBottom: 5,
	},

	// Detail items at the top (Date, Total Duration, Short Duration)
	details: {
		gap: 4,
		marginBottom: 5,
	},

	// Footer note
	footNote: {
		marginTop: 10,
		fontSize: 6,
		fontFamily: "Roboto",
		fontWeight: 700,
	},
});

export default function TimesheetPdf({
	title,
	data,
	currentTime,
	footnote,
	settings,
}: Props) {
	// Get the total elapsed duration
	const duration = getTotalDuration(data.entries, currentTime);

	const currentDate = formatPdfDate(currentTime, settings);
	const totalDuration = formatDurationLong(duration);
	const totalDurationShort = formatDurationShort(duration);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.heading}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.title}>Timesheet</Text>
				</View>

				<View style={styles.details}>
					<TimesheetPdfDetailField name="Date" value={currentDate} />
					<TimesheetPdfDetailField
						name="Total Duration"
						value={totalDuration}
					/>
					<TimesheetPdfDetailField
						name="Total Duration (hours)"
						value={totalDurationShort}
					/>
				</View>

				<TimesheetPdfTable
					data={data}
					currentTime={currentTime}
					totalDuration={totalDuration}
					settings={settings}
				/>

				<Text style={styles.footNote} wrap={false}>
					{footnote}
				</Text>
			</Page>
		</Document>
	);
}
