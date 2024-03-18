import {
  isEol,
  isSpace,
  newBlocksSequenceReader,
  newCharReader,
  newCompositeTokenizer,
  newFencedBlockReader,
  newTokensSequenceReader,
} from "../base/index.ts";
import type { TTokenizerMethod, TokenizerContext } from "../base/index.ts";

export type TMdTableTokenizers = {
  readTableCellContent?: TTokenizerMethod;
};

export function newMdTableReader(
  options: TMdTableTokenizers
): TTokenizerMethod {
  const readTableCellContent = options.readTableCellContent;

  const readTableCellSeparator = newCharReader(
    "MdTableCellSeparator",
    (char) => char === "|"
  );

  const readTableRowStart = (ctx: TokenizerContext) =>
    ctx.guard(() => {
      const start = ctx.i;
      if (ctx.skipWhile(isEol, 1) === start && start > 0) return;
      ctx.skipWhile(isSpace);
      const separator = readTableCellSeparator(ctx);
      if (!separator) return;
      const end = ctx.i;
      return {
        ...separator,
        type: "MdTableRowStart",
        end,
        value: ctx.substring(start, end),
      };
    });

  const readTableRowEnd = (ctx: TokenizerContext) =>
    ctx.guard(() => {
      const start = ctx.i;
      const separator = readTableCellSeparator(ctx);
      if (!separator) return;
      ctx.skipWhile(isSpace);
      const end = ctx.i;
      if (!isEol(ctx.getChar())) return;
      return {
        ...separator,
        type: "MdTableRowEnd",
        end,
        value: ctx.substring(start, end),
      };
    });

  const readTableCells = newBlocksSequenceReader(
    "MdTableCell",
    newCompositeTokenizer([
      readTableRowStart,
      readTableRowEnd,
      readTableCellSeparator,
    ]),
    readTableCellContent
  );

  const readTableRow = newFencedBlockReader(
    "MdTableRow",
    readTableRowStart,
    newCompositeTokenizer([readTableCellSeparator, readTableCells]),
    readTableRowEnd
  );

  const readTable = newTokensSequenceReader("MdTable", readTableRow);
  return readTable;
}
