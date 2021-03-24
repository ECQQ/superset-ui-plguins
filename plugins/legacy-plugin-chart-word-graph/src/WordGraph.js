/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint-disable no-param-reassign, react/sort-prop-types */
import { Network } from 'vis-network';
import PropTypes from 'prop-types';
import { CategoricalColorNamespace } from '@superset-ui/core';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string,
      target: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  width: PropTypes.number,
  height: PropTypes.number,
  colorScheme: PropTypes.string,
};

function WordGraph(element, props) {
  const { data, width, height, colorScheme } = props;

  element.className = 'superset-legacy-word-graph';

  const colorFn = CategoricalColorNamespace.getScale(colorScheme);

  // nodes
  const nodeDict = new Map();
  let k = 1;

  data.forEach(link => {
    if (!nodeDict.has(link.source)) {
      nodeDict.set(link.source, k);
      k += 1;
    }

    if (!nodeDict.has(link.target)) {
      nodeDict.set(link.target, k);
      k += 1;
    }
  });

  const nodes = [];
  nodeDict.forEach((value, key) => {
    nodes.push({ id: value, value: 1, label: key, color: colorFn(key) });
  });

  // edges
  const edges = [];
  let title;
  data.forEach(link => {
    title = `${link.source} ${link.target}`;
    edges.push({
      from: nodeDict.get(link.source),
      to: nodeDict.get(link.target),
      value: link.value,
      title,
      color: colorFn(title),
    });
  });

  // create network
  const graphData = {
    nodes,
    edges,
  };

  const options = {
    width: `${width}px`,
    height: `${height}px`,
    nodes: {
      shape: 'dot',
    },
  };

  // eslint-disable-next-line no-new
  new Network(element, graphData, options);
}

WordGraph.displayName = 'WordGraph';
WordGraph.propTypes = propTypes;

export default WordGraph;
