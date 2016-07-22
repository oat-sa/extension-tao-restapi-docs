<?php
/**  
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 * 
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 *               
 * 
 */               

return array(
    'name' => 'taoRestApiDocs',
	'label' => 'TAO Rest API documentation',
	'description' => 'Documentation of the TAO Rest API. Collect and view.',
    'license' => 'GPL-2.0',
    'version' => '0.0.1',
	'author' => 'Open Assessment Technologies SA',
	'requires' => array(
        'taoRestAPI' => '>=0.0.1'
    ),
	'managementRole' => 'http://www.tao.lu/Ontologies/generis.rdf#taoRestApiDocsManager',
    'acl' => array(
        array('grant', 'http://www.tao.lu/Ontologies/generis.rdf#taoRestApiDocsManager', array('ext'=>'taoRestApiDocs')),
    ),
    'install' => array(
        'php' => [
            \oat\taoRestApiDocs\scripts\install\RegisterRestApiDocsStorage::class
        ]
    ),
    'uninstall' => array(
    ),
    'routes' => array(
        '/taoRestApiDocs' => 'oat\\taoRestApiDocs\\controller'
    ),    
	'constants' => array(
	    # views directory
	    "DIR_VIEWS" => dirname(__FILE__).DIRECTORY_SEPARATOR."views".DIRECTORY_SEPARATOR,
	    
		#BASE URL (usually the domain root)
		'BASE_URL' => ROOT_URL.'taoRestApiDocs/',
	    
	    #BASE WWW required by JS
	    'BASE_WWW' => ROOT_URL.'taoRestApiDocs/views/'
	),
    'extra' => array(
        'structures' => dirname(__FILE__).DIRECTORY_SEPARATOR.'controller'.DIRECTORY_SEPARATOR.'structures.xml',
    )
);
